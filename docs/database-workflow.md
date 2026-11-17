# Database workflow (Neon)

Neon project `ecoexpense-main` (`steep-rice-47162131`, aws-eu-central-1, Postgres 16).

| Branch | Role | Used by |
|---|---|---|
| `main` (root) | Production data. Never experiment here. | Netlify **Production** `DATABASE_URL` |
| `dev` (child of main) | Development. Safe to migrate, reset, break. | Local `.env` `DATABASE_URL`, Netlify Deploy Previews / Branch deploys |
| `test` (child of dev) | Throwaway. **Wiped on every `yarn rw test api`.** | `TEST_DATABASE_URL` |

Get a connection string (never commit or paste these):

```bash
neon connection-string dev  --project-id steep-rice-47162131
neon connection-string test --project-id steep-rice-47162131   # non-pooled: keep it that way
neon connection-string main --project-id steep-rice-47162131 --pooled
```

## Rules

1. Local `.env` `DATABASE_URL` points at **`dev`**, never `main`.
2. `yarn rw prisma migrate dev` (and any reset) only ever runs against `dev`. It can offer to
   wipe the schema on drift; answer **no** and read the drift summary first.
3. Commit the migration folder in `api/db/migrations/` together with the `schema.prisma` change.
4. Never run `prisma migrate dev`, `migrate reset` or `db push` against `main`.

## Migrating production

Automatic. The Netlify build is `yarn rw deploy netlify`, whose Redwood handler runs
`prisma migrate deploy` and then `data-migrate up` against Netlify's `DATABASE_URL`.
`migrate deploy` only applies pending migrations; it never resets.

**Scope `DATABASE_URL` by context in Netlify** (Site settings, Environment variables):

- Production: `main`
- Deploy Previews and Branch deploys: `dev`

If one value is shared by all contexts, a preview build of a branch with a new migration
migrates production.

Check state without changing anything: `DATABASE_URL=<url> yarn rw prisma migrate status`.

## Tests

`yarn rw test api` sets `DATABASE_URL = TEST_DATABASE_URL` and runs
`prisma db push --force-reset --accept-data-loss` first (Redwood jest `globalSetup`).
So `TEST_DATABASE_URL` must be a disposable database: the `test` branch.

## Refreshing dev

Neon console, Branches, `dev`, **Reset from parent**. This discards `dev`'s own schema
changes, so do it only when no migration is in progress. Do the same for `test` if it drifts.

## Recovery

- `main` is a root branch, so Neon **Restore** (point-in-time) works within the plan's
  history window. Restore creates a backup branch automatically.
- Child branches (`dev`, `test`) do not support instant restore. Recreate them from `main`.
- Take a manual dump before risky operations (use a client of at least the server's major version):

  ```bash
  /usr/lib/postgresql/17/bin/pg_dump "$(neon connection-string main --project-id steep-rice-47162131)" \
    -Fc --no-owner --no-acl -f ~/ecoexpense-$(date +%F).dump
  ```

## Not set up

No CI exists (`.github/workflows` is absent): tests do not run on pull requests. If added, run
`yarn rw test` with `TEST_DATABASE_URL` pointing at `test`, and give CI no access to `main`.
