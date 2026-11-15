# deepmerge 4.3.1, patched

Upstream deepmerge 4.3.1 (MIT, see `license.txt`) with one change in `getKeys()`
in `index.js`, `dist/cjs.js` and `dist/umd.js`: an own `"__proto__"` key is never
copied, so `mergeObject()` cannot set the prototype of the object it returns
(GHSA-gcqx-w48m-w2h4). No fixed deepmerge release exists.

Only the `shadcn` CLI (devDependency) uses it. `package.json` `overrides` points
every `deepmerge` here; `tests/deepmerge-patch.test.ts` checks the fix. Delete this
folder and the override once deepmerge ships a fix.
