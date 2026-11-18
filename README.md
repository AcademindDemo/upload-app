# Upload App: first deploy

The upload app from Alchemy: Fundamentals for TypeScript Developers, at the end of Sections 1 and 2: one hello Worker in the Stack `UploadApp`, its packages pinned to the versions the course uses, Alchemy 2.0.0-beta.87 and Effect 4.1.4.

Where you are in the course: the project from `alf-install-alchemy`, deployed in `alf-first-deploy` and read in `alf-a-worker-in-the-stack` and `alf-read-a-stack`; Section 2 (`alf-plan-and-deploy` to `alf-lab-first-deploy-terminal`) changes, replaces and destroys this same Worker and ends where it starts.

## Run it

```sh
pnpm install
pnpm alchemy profile edit --add Cloudflare
pnpm alchemy deploy
```

`pnpm install` needs Node 24.11.1 or newer and installs exactly the locked versions; `pnpm-workspace.yaml` already allows workerd's build. The profile command signs you in to your Cloudflare account through the browser, once per computer. `pnpm alchemy deploy` shows the plan, asks `Deploy?` and prints the Worker's URL; `curl` it and it answers `hello`.

`pnpm exec tsc` typechecks the project.
