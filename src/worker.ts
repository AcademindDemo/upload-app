import * as Cloudflare from "@alchemy.run/cloudflare";
import { Effect } from "effect";
import { HttpServerResponse } from "effect/http";

export default Cloudflare.Worker(
  "Worker",
  { main: import.meta.url },
  Effect.succeed({
    fetch: Effect.succeed(HttpServerResponse.text("hello")),
  }),
);
