import * as Cloudflare from "@alchemy.run/cloudflare";
import { Effect, Schema } from "effect";
import { HttpRouter, HttpServerRequest, HttpServerResponse } from "effect/http";
import { Uploads } from "./uploads.ts";

const File = HttpRouter.schemaPathParams(Schema.Struct({ key: Schema.String }));

const Upload = HttpServerRequest.schemaHeaders(
  Schema.Struct({
    "content-length": Schema.NumberFromString.check(Schema.isInt(), Schema.isGreaterThan(0)),
  }),
);

export default Cloudflare.Worker(
  "Worker",
  { main: import.meta.url },
  Effect.gen(function* () {
    const uploads = yield* Cloudflare.R2.ReadWriteBucket(Uploads);

    const store = Effect.gen(function* () {
      const { key } = yield* File;
      const headers = yield* Upload;
      const request = yield* HttpServerRequest.HttpServerRequest;
      yield* uploads.put(key, request.stream, { contentLength: headers["content-length"] });
      return HttpServerResponse.text("Stored", { status: 201 });
    });

    const read = Effect.gen(function* () {
      const { key } = yield* File;
      const object = yield* uploads.get(key);
      if (object === null) {
        return HttpServerResponse.text("Not found", { status: 404 });
      }
      return HttpServerResponse.text(yield* object.text());
    });

    const fetch = yield* HttpRouter.toHttpEffect(
      HttpRouter.addAll([HttpRouter.route("PUT", "/:key", store), HttpRouter.route("GET", "/:key", read)]),
    );

    return {
      fetch: fetch.pipe(
        Effect.catchTags({
          SchemaError: () => Effect.succeed(HttpServerResponse.text("Bad request", { status: 400 })),
          R2Error: (error) =>
            Effect.logError(error).pipe(Effect.as(HttpServerResponse.text("Storage unavailable", { status: 500 }))),
        }),
      ),
    };
  }).pipe(Effect.provide(Cloudflare.R2.ReadWriteBucketBinding)),
);
