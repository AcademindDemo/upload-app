# Upload App: shipped from CI

The upload app from Alchemy: Fundamentals for TypeScript Developers, at the end of the course, Alchemy 2.0.0-beta.87 and Effect 4.1.4. The Worker reads two values while it is deployed: `MAX_UPLOAD_BYTES`, an upload over it answers `413 Too large`, and the secret `WEBHOOK_KEY`, which a `POST /webhook` must carry in its `x-webhook-key` header. `Uploads` is a plain bucket, as in the course from Section 6 on: a destroy deletes it only while it is empty, since R2 refuses to delete a bucket that holds files (`BucketNotEmpty`). `test/integ.test.ts` runs the Stack on Alchemy's local stand-ins, stores a file and reads it back, and checks the 404 for a missing one. GitHub Actions deploys a `pr-<number>` stage for each pull request and destroys it on close (`.github/workflows/preview.yml`), and deploys `prod` on every push to `main` (`.github/workflows/deploy.yml`).

Where you are in the course: the upload limit from `alf-worker-settings`, the webhook key from `alf-secrets-and-settings`, a file of values per stage from `alf-values-per-stage`, the test from `alf-test-a-stack`, the token, the CI deploy and the preview workflow from `alf-ci-token`, `alf-deploy-from-ci` and `alf-ci-preview-stages`. The course's own production is your `live_` stage; a project shared with a team deploys `prod` from CI instead, as Alchemy's CI guide does.

## Checkpoints

One tag per checkpoint. A lecture that changes the project starts at the tag the sections before it left:

| Tag | What the project holds | Lecture that opens on it |
|---|---|---|
| `first-deploy` | the starter: one hello Worker in the Stack `UploadApp` | Adding an R2 Bucket to the Stack (`alf-add-a-bucket`) |
| `store-files` | the `Uploads` bucket, bound to a Worker that stores and reads files | Deploying to Stages (`alf-stages`) |
| `outputs` | the Stack returns `url` and `bucketName` | Logical IDs (`alf-logical-ids`) |
| `keep-the-data` | the bucket retained (`Alchemy.RemovalPolicy.retain()`) | Reading Worker Settings (`alf-worker-settings`) |
| `settings-and-secrets` | the upload limit and the webhook key, `.env.example`, the bucket plain again | Testing a Deployed Stack (`alf-test-a-stack`) |
| `tested` | `test/integ.test.ts` and its dev dependencies | A Token for CI (`alf-ci-token`) |
| `ci` | the preview and production workflows | the course's end state |

The starter is also the course's `hello-worker.zip`, from Installing Alchemy (`alf-install-alchemy`). To work from a checkpoint, check its tag out:

```sh
git clone https://github.com/AcademindDemo/upload-app.git
cd upload-app
git checkout store-files
```

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

## Ship it from GitHub

1. Make an API token for the runner in the Cloudflare dashboard (`alf-ci-token`; Alchemy's CI guide lists the permission groups).
2. In the repository's Settings, Secrets and variables, Actions, add `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `MAX_UPLOAD_BYTES` and `WEBHOOK_KEY` as repository secrets.
3. For prod's own values, add `MAX_UPLOAD_BYTES` and `WEBHOOK_KEY` again as secrets of the environment `production` (Settings, Environments); they win over the repository's. Its deployment branch rule can limit it to `main`.
4. Open a pull request: `preview.yml` deploys `pr-<number>`, and closing it destroys that stage. Merge it: `deploy.yml` typechecks and deploys `prod`.

Pull requests from forks get no secrets, so their preview job fails; previews here are for branches of this repository.
