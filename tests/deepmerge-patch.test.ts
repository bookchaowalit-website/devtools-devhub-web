import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const deepmerge = require("deepmerge");

test("deepmerge override never sets the prototype from an own __proto__ key (GHSA-gcqx-w48m-w2h4)", () => {
  const evil = JSON.parse('{"__proto__":{"polluted":true},"a":1}');
  assert.equal(deepmerge(1, evil).polluted, undefined);
  assert.equal(deepmerge(evil, { b: 2 }).polluted, undefined);
  assert.deepEqual(deepmerge(1, evil), { a: 1 });
  assert.deepEqual(deepmerge({ a: { b: 1 } }, { a: { c: 2 } }), { a: { b: 1, c: 2 } });
});
