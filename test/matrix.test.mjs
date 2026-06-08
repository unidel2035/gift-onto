/**
 * matrix.test.mjs — the invariants of the gift matrix, in code.
 * Pure logic, no API key needed. Run: node --test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Matrix, WEIGHT } from '../demo/gift-matrix.mjs';

test('axiom 1 — acts are irreversible and frozen', () => {
  const m = new Matrix();
  const act = m.give('A', 'B', 'code');
  assert.equal(act.irreversible, true);
  assert.ok(Object.isFrozen(act), 'act must be frozen');
  assert.throws(() => { act.weight = 999; }, 'frozen act must reject mutation');
});

test('axiom 2 — asymmetry of value (time heavier than money)', () => {
  assert.ok(WEIGHT.time > WEIGHT.money, 'time must weigh more than money');
  assert.equal(WEIGHT.time, 10);
  assert.equal(WEIGHT.money, 3);
});

test('append-only — the log only grows, threads accumulate', () => {
  const m = new Matrix();
  m.give('A', 'B', 'code');       // 5
  m.give('A', 'B', 'knowledge');  // 4
  m.give('B', 'A', 'question');   // 3
  assert.equal(m.log.length, 3);
  assert.equal(m.thread('A', 'B'), 9);
  assert.equal(m.thread('B', 'A'), 3);
});

test('metric — energy is given minus received', () => {
  const m = new Matrix();
  m.give('A', 'B', 'code');       // A +5
  m.give('A', 'B', 'knowledge');  // A +4
  m.give('B', 'A', 'question');   // A receives 3
  const mx = m.metrics();
  const A = mx.persons.find(p => p.id === 'A');
  const B = mx.persons.find(p => p.id === 'B');
  assert.equal(A.energy, 6);      // 9 given - 3 received
  assert.equal(B.energy, -6);
  assert.equal(A.conductivity, 1);          // gave more than received → conduit
  assert.ok(Math.abs(B.conductivity - 1/3) < 1e-9);
});

test('metric — asymmetry measures the imbalance and its direction', () => {
  const m = new Matrix();
  m.give('A', 'B', 'code');       // 5
  m.give('A', 'B', 'knowledge');  // 4  → A→B = 9
  m.give('B', 'A', 'question');   // 3  → B→A = 3
  const [asym] = m.metrics().asymmetry;
  assert.equal(asym.delta, 6);
  assert.equal(asym.favors, 'A');
});

test('metric — deserts are ordered pairs with no thread', () => {
  const m = new Matrix();
  m.give('A', 'B', 'code');       // A→B exists; B→A does not
  const deserts = m.metrics().deserts;
  assert.ok(deserts.some(d => d.from === 'B' && d.to === 'A'), 'B→A is a desert');
  assert.ok(!deserts.some(d => d.from === 'A' && d.to === 'B'), 'A→B is not a desert');
});
