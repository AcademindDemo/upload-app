# Upload App: keeping the data

The upload app from Alchemy: Fundamentals for TypeScript Developers, at the end of `alf-keep-the-data` in Section 5, Alchemy 2.0.0-beta.87 and Effect 4.1.4. The `Uploads` bucket is retained (`Alchemy.RemovalPolicy.retain()`): a destroy or a removed declaration drops it from state and leaves the bucket and its files in your account, on every stage. The course's take is to retain production's bucket and keep the default on your own and disposable copies.

Where you are in the course: logical IDs from `alf-logical-ids` and `alf-rename-a-resource`, `retain` and `forceDestroy` from `alf-keep-the-data`.

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
