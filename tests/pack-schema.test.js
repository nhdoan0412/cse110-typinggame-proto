import assert from "node:assert/strict";
import { packs } from "../src/packs.js";

assert.ok(Array.isArray(packs), "packs must be an array");
assert.ok(packs.length >= 3, "prototype should include at least three packs");

const ids = new Set();
for (const pack of packs) {
  assert.equal(typeof pack.id, "string", "pack id is required");
  assert.ok(!ids.has(pack.id), `duplicate pack id: ${pack.id}`);
  ids.add(pack.id);
  assert.equal(typeof pack.name, "string", `${pack.id} needs a name`);
  assert.equal(typeof pack.description, "string", `${pack.id} needs a description`);
  assert.ok(Array.isArray(pack.levels), `${pack.id} levels must be an array`);
  assert.ok(pack.levels.length >= 3, `${pack.id} should have at least three levels`);
  for (const level of pack.levels) {
    assert.equal(typeof level.concept, "string", `${pack.id} level needs a concept`);
    assert.equal(typeof level.code, "string", `${pack.id} level needs code`);
    assert.ok(level.code.length > 0, `${pack.id} level code cannot be empty`);
    assert.equal(typeof level.summary, "string", `${pack.id} level needs a player summary`);
    assert.ok(level.summary.length >= 40, `${pack.id} level summary should be useful`);
    assert.equal(typeof level.tip, "string", `${pack.id} level needs a typing tip`);
    assert.equal(typeof level.reward, "string", `${pack.id} level needs a reward label`);
  }
}

console.log(`Validated ${packs.length} packs.`);
