import * as Alchemy from "alchemy";
import * as Cloudflare from "@alchemy.run/cloudflare";
import { Effect } from "effect";
import Worker from "./src/worker.ts";

export default Alchemy.Stack(
  "UploadApp",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const worker = yield* Worker;

    return {
      url: worker.url,
    };
  }),
);
