# Receipt uploads: Google Cloud Storage runbook

Receipt files are uploaded by the browser directly to the bucket
`ecoexpense-receipts` using V4 signed PUT URLs minted by the
`createUploadUrl` GraphQL mutation. Objects are public-read
("capability URLs" — safe because filenames are unguessable UUIDs).

## What lives where

| Thing | Value / location |
| --- | --- |
| Bucket | `gs://ecoexpense-receipts` (project `ecoexpense`) |
| Objects | `receipts/<uuid4>.<ext>`, public-read |
| Orphan prevention | Uploads land in `receipts/pending/` and are moved to `receipts/` when the expense is saved; a bucket lifecycle rule deletes pending objects after 7 days (`infra/gcs-lifecycle.json`) |
| Service account | `receipts-upload@ecoexpense.iam.gserviceaccount.com` |
| Env vars | Root `.env`: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_CLIENT_EMAIL`, `GOOGLE_CLOUD_PRIVATE_KEY`, `GOOGLE_CLOUD_BUCKET_NAME` |
| CORS source of truth | `infra/gcs-cors.json` (checked into the repo) |
| API code | `api/src/services/receipts/receipts.ts`, `api/src/lib/storage.ts` |
| Upload UI | `web/src/components/Expense/ExpenseForm/UploadReciepts.tsx` (shared by all 7 expense forms) |

> **Important:** the api dev server loads only the **root** `.env` — it never
> loads `api/.env`. Keep the `GOOGLE_CLOUD_*` vars in the root `.env`.

## One-time setup (already done, kept for reference)

Requires `gcloud auth login` once.

```bash
# 1. Allow browser PUT/GET from the app origins
yarn gcs:apply-cors

# 2. Make stored receipts publicly readable (unguessable-URL sharing)
yarn gcs:make-public

# 3. Auto-delete abandoned uploads (see "Orphaned uploads" below)
yarn gcs:apply-lifecycle
```

## Orphaned uploads (abandoned forms)

Uploads happen immediately when the user picks a file, so a receipt whose
expense is never saved would be orphaned. This is handled without any cron
jobs:

1. `createUploadUrl` places new uploads under `receipts/pending/`
2. When the expense is saved, `finalizePendingReceipt` (called from
   `createExpense`/`updateExpense`) copies the object to `receipts/` and
   deletes the pending one — the DB stores the permanent URL
3. A bucket lifecycle rule deletes `receipts/pending/*` after 7 days, so
   abandoned uploads clean themselves up

Replacing or removing a receipt deletes the old object immediately
(`deleteReceipt`), and deleting an expense deletes its receipt object too.
If a pending object has already expired when the user finally saves, the
save fails with "The uploaded receipt has expired and must be uploaded
again".

Apply/inspect the lifecycle rule with `yarn gcs:apply-lifecycle` /
`yarn gcs:get-lifecycle`.

## Before every production deploy

1. **Add the production origin to CORS** — edit `infra/gcs-cors.json`,
   replace the `REPLACE-WITH-PRODUCTION-DOMAIN.example` entry with the real
   domain (keep `http://localhost:8910` for local dev), then run:

   ```bash
   yarn gcs:apply-cors
   ```

2. **Set the four `GOOGLE_CLOUD_*` env vars in Netlify**
   (Site settings → Environment variables). Copy the values from the root
   `.env`. Without them, uploads fail in production and the error is masked
   as "Something went wrong" — the real cause is only visible in the api
   function logs.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Toast: "Receipt storage is not configured" | `GOOGLE_CLOUD_*` vars missing from the loaded env. Locally: root `.env` + restart `yarn rw dev`. In production: Netlify env vars. |
| Toast: "Could not reach the upload destination…" | Bucket CORS config missing or doesn't include the origin → `yarn gcs:apply-cors` after editing `infra/gcs-cors.json`. Verify live config with `yarn gcs:get-cors`. |
| Toast: "Something went wrong" in production | Any unmasked-server error. Check the Netlify function logs; `createUploadUrl` logs signing failures with details. |
| Image preview doesn't load (403 on the object URL) | Public read missing → `yarn gcs:make-public` (fails only if public access prevention is *enforced*; then relax it in the GCP console). |
| `SigningError: DECODER routines::unsupported` in api logs | Malformed `GOOGLE_CLOUD_PRIVATE_KEY`. `api/src/lib/storage.ts` normalizes all common formats (PEM-escaped, multiline, bare base64); if it still fails, re-export the key. |
| Old receipts show "Receipt unavailable" | Legacy Filestack files (dead account). Not recoverable; replacing the receipt works normally. |

## Verify end-to-end

1. `/expenses/new` → Upload a JPG → preview renders
2. Save the expense → the Receipt row URL starts with
   `https://storage.googleapis.com/ecoexpense-receipts/`
3. Open the stored URL in an incognito window → image loads (200)
4. Replace the image → the old object disappears from the bucket
