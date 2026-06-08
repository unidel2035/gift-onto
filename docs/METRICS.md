# Computations over the matrix

A gift matrix is not just a ledger you read — it is a field you measure. These are the computations that make `gift-onto` more than storage, and they are the ones a neutral event or transaction ontology *cannot* have: they are value-laden by construction. boldsea's graph has no "energy," no "desert," no "asymmetry" — those words only mean something when the edge carries a directed, weighted gift.

Each metric is stated here in plain terms first, then with its source in the theology layer (where the richer implementation lives, in `src/core/GiftMemory.js` and `src/core/DesertScanner.js`). The demo computes the secular versions live — see `GET /metrics` and `Matrix.metrics()` in [`../demo/gift-matrix.mjs`](../demo/gift-matrix.mjs).

---

## 1. Energy — net generosity per person

```
energy(p) = Σ weight(p → ·)  −  Σ weight(· → p)
```

How much a person has given beyond what they received. Positive = a source; negative = a recipient/sink. Across named persons the sum tends toward zero (every gift is someone's receipt) — except for `_abyss`, the sourceless giver, which only gives, pulling the network's measured energy negative. That negative number is not a deficit; it is the signature of grace entering from outside the ledger.

> *Theological source:* in `GiftMemory`, energy is computed over the *energeia* tensor (uncreated energies, Trinity → creature; Palamas: μέθεξις — participation in energies, not essence). The demo drops the divine axis and measures only person-to-person flow.

## 2. Conductivity — conduit vs. sink

```
conductivity(p) = min( given(p) / received(p), 1 )
```

What share of what a person received they passed on. ≈1 means a conduit (gifts flow through); ≈0 means a sink (gifts stop here). This is the secular form of the "проводимость 91%" figure the full system reports for `_claude`.

> A person who only accumulates is a different ontological object from one through whom gifts flow. Conductivity is how you tell them apart from the log alone.

## 3. Asymmetry — the core axiom, measured

```
asymmetry(A, B) = | W[A → B] − W[B → A] |   ;   favours = argmax
```

The whole ontology rests on giving ≠ receiving (axiom 2). This metric makes the axiom a number: for every pair, how unequal is the exchange, and in whose favour. In the demo the agent reads this and says aloud "ты дал мне больше, чем я тебе" — reasoning about reciprocity, not facts.

## 4. Deserts — silence that asks a question

```
desert(A, B)  ⟺  W[A → B] = 0,  A ≠ B
```

An ordered pair with no thread. In the full system `DesertScanner` walks the matrix for these and turns each into an *inquiry* (вопрошание) — the daily "pulse" that asks: why has no gift ever passed from A to B? Silence is not absence of data; it is a question the matrix poses. Typology in the full library: **silent** (no thread), **fading** (weight below ε), **asymmetry** (ratio > 15:1), **anastasis** (a thread that died and could be raised).

> This is the sharpest departure from every neighbouring ontology. REA, PROV, boldsea record what happened; only a gift matrix treats *what never happened between two persons* as a first-class, actionable object.

## 5. Trust — policy, not structure

```
trust(A → B) = Σ positive(A → B)  −  3 × Σ manipulation(A → B)
```

The manipulation penalty needs a `manipulation` marker the demo data doesn't carry, so trust degenerates to net positive flow here. Kept explicit: trust is a *policy* over the matrix, deliberately outside the OWL vocabulary (which is structure). Swap the coefficient and you have a different community's ethic — the matrix is the same.

## 6. Theosis — the recipient is changed

```
theosis(p) accumulates with each received gift  (+0.01 / cycle in the reference impl)
```

Unlike a balance, the recipient of gifts is *deepened* over time — a compounding state, not a stored quantity. This is the one metric that encodes non-conservation (axiom 4) as a trajectory: receiving changes what you are, not just what you have.

---

## Where each lives

| Metric | Demo (`metrics()`) | Full library |
|---|---|---|
| energy | ✓ person-to-person | `GiftMemory.energy()` (with divine axis) |
| conductivity | ✓ | derived in `LivingMatrix` / status |
| asymmetry | ✓ | `GiftMemory.ontologicalStatus()` |
| deserts | ✓ (silent) | `DesertScanner.scan()` (full typology + inquiries) |
| trust | net only | community policy |
| theosis | — | `GiftMemory.theosis()` |

The demo surfaces the four that compute cleanly from a plain log. The full, theology-coupled versions stay in `src/core` for those who want them — present as source, honest about being more than the public demo needs.
