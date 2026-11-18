import * as Cloudflare from "@alchemy.run/cloudflare";
import * as Test from "@alchemy.run/test/Vitest";
import { Effect } from "effect";
import { HttpBody, HttpClient } from "effect/http";
import { expect } from "vitest";
import Stack from "../alchemy.run.ts";

const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
  providers: Cloudflare.providers(),
  state: Cloudflare.state(),
  dev: true,
});

const stack = beforeAll(deploy(Stack));
afterAll(destroy(Stack));

test(
  "stores a file and reads it back",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const put = yield* HttpClient.put(`${url}/hello.txt`, {
      body: HttpBody.text("Hello, World!"),
    });
    expect(put.status).toBe(201);

    const get = yield* HttpClient.get(`${url}/hello.txt`);
    expect(yield* get.text).toBe("Hello, World!");
  }),
);

test(
  "answers 404 for a missing file",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* HttpClient.get(`${url}/no-such-file.txt`);
    expect(response.status).toBe(404);
  }),
);
