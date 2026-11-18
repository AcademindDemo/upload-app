# Upload App: stages and outputs

The upload app from Alchemy: Fundamentals for TypeScript Developers, at the end of Section 4: the Stack returns the Worker's `url` and the bucket's `bucketName` as Outputs, and deploys to any stage, Alchemy 2.0.0-beta.87 and Effect 4.1.4.

Where you are in the course: stages from `alf-stages`, the two Outputs from `alf-outputs`, local runs from `alf-dev-locally`.

## Run it

```sh
pnpm install
pnpm alchemy deploy
pnpm alchemy deploy --stage preview
pnpm alchemy dev
```

Signed in once with `pnpm alchemy profile edit --add Cloudflare`, the first deploy goes to your own stage, `live_<your user name>`, and prints both Outputs; `--stage preview` deploys a second, separate copy; `alchemy dev` runs the app on local stand-ins at `http://localhost:1337`. With a printed URL:

```sh
curl -i -X PUT --data "Hello, World!" <url>/hello.txt
curl -i <url>/hello.txt
curl -i <url>/no-such-file.txt
```

The first answers `201 Stored`, the second `Hello, World!`, the third `404 Not found`.

`pnpm exec tsc` typechecks the project.
