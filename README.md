# Upload App: a tested stack

The upload app from Alchemy: Fundamentals for TypeScript Developers, after `alf-test-a-stack` in Section 7, Alchemy 2.0.0-beta.87 and Effect 4.1.4. The Worker reads two values while it is deployed: `MAX_UPLOAD_BYTES`, an upload over it answers `413 Too large`, and the secret `WEBHOOK_KEY`, which a `POST /webhook` must carry in its `x-webhook-key` header. `Uploads` is a plain bucket, as in the course from Section 6 on: a destroy deletes it only while it is empty, since R2 refuses to delete a bucket that holds files (`BucketNotEmpty`). `test/integ.test.ts` runs the Stack on Alchemy's local stand-ins, stores a file and reads it back, and checks the 404 for a missing one.

Where you are in the course: the upload limit from `alf-worker-settings`, the webhook key from `alf-secrets-and-settings`, a file of values per stage from `alf-values-per-stage`, the test from `alf-test-a-stack`.

## Run it

Copy `.env.example` to `.env` and set your own webhook key, then make a `.env.preview` with the preview stage's values. Neither file goes into git (`.gitignore`).

```sh
pnpm install
pnpm alchemy deploy
pnpm alchemy deploy --stage preview --env-file .env.preview
pnpm alchemy dev
```

Signed in once with `pnpm alchemy profile edit --add Cloudflare`, a deploy reads the values from your terminal's environment first, then from `.env`; `--env-file` names the one file to read instead, and its values win. A missing value stops the plan with a `ConfigError` naming it. With a printed URL:

```sh
curl -i -X PUT --data "Hello, World!" <url>/hello.txt
curl -i <url>/hello.txt
curl -i -X POST -H "x-webhook-key: <your key>" <url>/webhook
```

The first answers `201 Stored`, the second `Hello, World!`, the third `200 accepted`, or `401 bad key` with a wrong key.

## Test it

```sh
pnpm exec vitest run
```

With `dev: true` in `Test.make`, the test runs the Stack on the same local stand-ins `alchemy dev` uses and calls it on localhost, so nothing is deployed. `Cloudflare.state()` still looks up your Cloudflare account, so sign in first (`pnpm alchemy profile edit --add Cloudflare`) or set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, and the Stack reads `MAX_UPLOAD_BYTES` and `WEBHOOK_KEY` like every deploy.

`pnpm exec tsc` typechecks the project, test included.
