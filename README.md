# Upload App: storing files

The upload app from Alchemy: Fundamentals for TypeScript Developers, at the end of Section 3: the Worker stores a `PUT`'s body in the R2 bucket `Uploads` under the path's key and reads it back on `GET`, Alchemy 2.0.0-beta.87 and Effect 4.1.4.

Where you are in the course: the bucket from `alf-add-a-bucket`, bound in `alf-bind-the-bucket`, routed in `alf-store-and-read-files` and its errors mapped to 400 and 500 in `alf-bucket-errors`.

## Run it

```sh
pnpm install
pnpm alchemy deploy
```

Signed in once with `pnpm alchemy profile edit --add Cloudflare`, the deploy creates the bucket and updates the Worker. Then, with the printed URL:

```sh
curl -i -X PUT --data "Hello, World!" <url>/hello.txt
curl -i <url>/hello.txt
curl -i <url>/no-such-file.txt
```

The first answers `201 Stored`, the second `Hello, World!`, the third `404 Not found`.

`pnpm exec tsc` typechecks the project.
