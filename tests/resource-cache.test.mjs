import test from "node:test";
import assert from "node:assert/strict";
import { createResourceCache } from "../src/lib/resource-cache.ts";

test("concurrent app preload and open share one request; reopening uses the snapshot", async () => {
  let queries = 0;
  const cache = createResourceCache(45000);
  const load = async () => { queries++; return ["public project"]; };
  const [first, second] = await Promise.all([cache.read("project", load), cache.read("project", load)]);
  assert.strictEqual(first, second);
  assert.strictEqual(await cache.read("project", load), first);
  assert.equal(queries, 1);
});

test("empty public collections are cached without another loading request", async () => {
  const cache = createResourceCache(45000);
  await cache.read("certificate", async () => []);
  assert.deepEqual(cache.peek("certificate"), []);
});

test("expired snapshots refresh before signed asset URLs expire", async () => {
  let now = 0;
  let requests = 0;
  const cache = createResourceCache(45000, () => now);
  const load = async () => `signed-url-${++requests}`;
  assert.equal(await cache.read("resume", load), "signed-url-1");
  now = 45000;
  assert.equal(cache.peek("resume"), undefined);
  assert.equal(await cache.read("resume", load), "signed-url-2");
});

test("content or auth invalidation prevents an old in-flight request repopulating cache", async () => {
  const cache = createResourceCache(45000);
  let finish;
  const old = cache.read("project", () => new Promise(resolve => { finish = resolve; }));
  await Promise.resolve();
  cache.clear();
  await cache.read("project", async () => ["new snapshot"]);
  finish(["stale snapshot"]);
  await old;
  assert.deepEqual(cache.peek("project"), ["new snapshot"]);
});

test("failed requests can retry and different app kinds never share records", async () => {
  const cache = createResourceCache(45000);
  await assert.rejects(cache.read("project", async () => { throw Error("offline"); }));
  assert.equal(await cache.read("project", async () => "projects"), "projects");
  assert.equal(await cache.read("resume", async () => "resume"), "resume");
});
