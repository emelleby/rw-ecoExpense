# Plan: Replace Filestack receipt upload with Google Cloud Storage

## Diagnosis (what is going on)

- The Filestack account is dead. `UploadReciepts.tsx` inits the picker with `REDWOOD_ENV_FILESTACK_API_KEY` (`.env`), but Filestack's upload API returns `404` on `upload.filestackapi.com/prefetch` and `/multipart/start` — the key no longer maps to an account.
- The picker modal still opens (client-side JS) and logs "Upload successful", but nothing uploaded, so `res.filesUploaded` is empty → `TypeError: Cannot read properties of undefined (reading 'url')` at `web/src/components/Expense/ExpenseForm/UploadReciepts.tsx:77`.
- Convex: not present anywhere in the codebase. Decision: **not** introducing it.
- Google Cloud Storage is **already fully configured but unused**:
  - `api/.env`: `GOOGLE_CLOUD_PROJECT_ID=ecoexpense`, `GOOGLE_CLOUD_CLIENT_EMAIL`, `GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_BUCKET_NAME=ecoexpense-receipts`
  - `api/src/lib/storage.ts` (GCS client), `api/src/lib/fileUpload.ts` (unused helper), `api/src/functions/uploadUrl.ts` (unused signed-URL REST function)
  - `web/src/components/Custom/FileUpload.tsx` (unused prototype with hardcoded localhost URL)

## Decisions made

1. **Storage**: Google Cloud Storage (existing bucket `ecoexpense-receipts`).
2. **Access**: public objects with unguessable UUID filenames (`receipts/<uuid-v4>.<ext>`) = capability URLs. URLs can be embedded in shared expense reports ("anyone with the link"). Tradeoff accepted: a leaked URL cannot be rotated without replacing the file.
3. **UX**: simple native file button + camera capture (mobile) + inline preview. No picker library. Images and PDFs allowed.

## Architecture

Flow (same for all 7 expense-type forms, since they all share `UploadReciepts.tsx`):

```
User picks file
  → GraphQL mutation createUploadUrl(contentType) [@requireAuth]
      returns { uploadUrl (signed V4 PUT, 15 min), fileUrl (public), fileName (receipts/<uuid>.<ext>) }
  → Browser PUTs file to uploadUrl
  → Form state setReceiptUrl/setFileName/setFileType (unchanged interface)
  → On expense save, existing nested Receipt create/upsert stores it (no change needed)
```

Delete flow (unchanged call site): `deleteReceipt(id, url)` mutation → now deletes the GCS object instead of Filestack remove.

## Tasks

### 1. API: `createUploadUrl` GraphQL mutation
- `api/src/graphql/receipts.sdl.ts`: add `createUploadUrl(contentType: String!): UploadUrlResult! @requireAuth` and type `UploadUrlResult { uploadUrl fileUrl fileName }`.
- `api/src/services/receipts/receipts.ts`: implement using `src/lib/storage.ts`:
  - Validate `contentType` starts with `image/` or is `application/pdf`; throw otherwise.
  - Derive extension from contentType; fileName = `receipts/${uuidv4()}.${ext}`.
  - `file.getSignedUrl({ version: 'v4', action: 'write', expires: now + 15min, contentType })`.
  - Return public URL `https://storage.googleapis.com/${bucketName}/${fileName}`.
- Delete `api/src/functions/uploadUrl.ts` (replaced; avoids two sources of truth).

### 2. One-time GCS bucket CORS config (manual, user action)
Browser PUT to signed URLs requires CORS on the bucket. Provide the user this config to apply once (`gsutil cors set` / `gcloud storage buckets update`):
```json
[{"origin": ["http://localhost:8910", "https://<production-domain>"],
  "method": ["PUT", "GET"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]
```

### 3. Web: rewrite `web/src/components/Expense/ExpenseForm/UploadReciepts.tsx`
Keep the existing props interface (`receiptUrl, fileName, fileType, id, setReceiptUrl, setFileName, setFileType`) so all 7 call sites need no changes.
- Hidden `<input type="file" accept="image/*,application/pdf">`; "Upload Receipt" button triggers it; add a camera button with `capture="environment"` for mobile.
- On change: call `createUploadUrl`, `PUT` the `File` to `uploadUrl` with the file's Content-Type, then set the three state values.
- Client-side validation: max ~10 MB, image/pdf only; loading via existing `useLoader`; errors via `toast.error`.
- Preview: plain `<img src={receiptUrl}>` for images; file icon + open link for PDFs. **Remove** the Filestack `thumbnail()` `resize=` URL hack.
- Legacy URLs: if `receiptUrl` is not a GCS URL (old Filestack files, now dead since the account is gone), render a "Receipt unavailable" placeholder instead of a broken image; Replace button must still work (delete handles legacy gracefully, see task 4).

### 4. API: rewrite `deleteReceipt` in `api/src/services/receipts/receipts.ts`
- If `url` contains `storage.googleapis.com/<bucket>/`, extract the object path and `bucket.file(path).delete({ ignoreNotFound: true })` (wrap in try/catch; deletion of the DB row must not fail on storage errors).
- If it's a legacy Filestack URL, skip storage deletion (files are gone anyway).
- Keep existing DB delete behavior (`id === 0` → success only).
- Remove Filestack imports and the `Filestack.getSecurity`/`client.remove` code.

### 5. Cleanup
- `yarn remove filestack-react filestack-js` in `web/`; `yarn remove filestack-js` in `api/`.
- Remove `REDWOOD_ENV_FILESTACK_API_KEY` / `REDWOOD_ENV_FILESTACK_SECRET` from `.env` and remind user to remove them from Netlify env vars.
- `web/src/components/Custom/FileUpload.tsx` becomes redundant → delete it.

## Out of scope / notes
- GCS objects uploaded but form abandoned stay orphaned (acceptable; optional future: bucket lifecycle rule).
- Old Filestack receipt files are unrecoverable (account gone); DB rows keep dead URLs and get the placeholder UI.
- No DB schema changes; no changes to expense create/update flow.

## Validation
1. `yarn rw typecheck` (or project equivalent) passes.
2. Dev run `yarn rw dev` → `/expenses/new`:
   - Upload a JPG from disk → preview shows; save expense → Receipt row in DB with `storage.googleapis.com/...` URL; object visible in bucket.
   - Upload a PDF → link/icon preview; save works.
   - Replace Image → old object deleted from bucket, new upload works.
   - Open the stored URL in an incognito window → image loads (sharing works).
   - Spot-check 2 of the 7 forms (e.g. Miscellaneous + PastFlights) since they share the component.
3. If PUT fails with CORS error in step 2, task 2 (bucket CORS) was not applied.

## Open items for user (manual)
- Apply the CORS config from task 2 to bucket `ecoexpense-receipts` (needs GCP console/gsutil access).
- Provide the production domain for the CORS origin list.
- Remove Filestack env vars from Netlify.
