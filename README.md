# gift-onto — the ontology of the gift

> An ontology whose primitive is neither the *thing*, nor the neutral *event*, nor the balanced *transaction*, but the **act of giving**: directed, asymmetric, irreversible, between persons — with surplus.

**gift-onto** is a small, MIT-licensed ontology and reference implementation. It models the substrate that exchange and causation sit on top of: who gave, to whom, what, at what weight — and irreversibly. An AI agent built on it reasons about **trust and reciprocity**, not just about facts or causation.

> Object ontologies record *what is*. Event ontologies record *what happened*. Transaction ontologies record *balanced, reversible exchange*. **gift-onto records the irreversible, asymmetric act that precedes all three — the gift.**

---

## The one question it answers

> *How does a system remember relationships in a way that lets it accumulate trust?*

Trust requires three things no existing ontology provides together:

1. **Irreversibility** — a record you cannot quietly rewrite (you can't trust a ledger that forgets).
2. **Asymmetry** — giving is not the same as receiving; the direction and imbalance *are* the information.
3. **Native value** — the worth of an act lives in the data itself (ethics as **weight**, not as an external rules engine bolted on top).

Add a fourth that makes cooperation worth modelling at all:

4. **Surplus** — the result of a gift can exceed its input. The system is **non-conserving** by design.

No mainstream ontology has all four. `gift-onto` is the attempt to have them as axioms.

---

## Primitives

```
GiftAct = (from, to, what, weight, irreversible, telos)
```

- **Person** — a named locus of acts (human, agent, source, or the shared recipient). Not an object.
- **GiftAct** — a directed, weighted, frozen act from one person to another. The atom.
- **Matrix W** — the relational tensor: a weighted directed graph of who-gave-what-to-whom, append-only.
- **Anamnesis** — memory in which past acts stay *present* and queryable; nothing is overwritten or deleted.
- **Surplus** — the non-conserved remainder: result minus input.

### The trust function

```
trust(A → B) = Σ (positive acts) − 3 × Σ (manipulations)
```

A manipulation-penalized score computed directly from the append-only log. This is the whole point: **morality is the weight of threads in W, not a list of rules.**

---

## Quick start

```js
import { GiftAct, TelosCheck } from 'gift-onto';

const check = TelosCheck(agent);          // does the agent's telos serve the recipient?
if (!check.valid) console.warn(check.warning);

const act = GiftAct.perichoresis();
act.give('A', 'B', 'attention', 10)        // who → whom, what, weight
   .free(true)                             // recipient decides — acceptance is freedom, not a completion condition
   .gratitude()                            // optional return movement (not an obligation)
   .surplus();                             // result may exceed input
```

---

## How it differs — the short version

| Family | Primitive | Reversible? | Symmetric? | Encodes value? | Question it answers |
|---|---|---|---|---|---|
| RDF/OWL, schema.org | thing + property | n/a (state) | — | no | *what is there?* |
| BFO / DOLCE (foundational) | continuant / occurrent | n/a | — | no | *what kinds of being exist?* |
| PROV-O (provenance) | entity / activity / agent | descriptive | no | no | *what was derived from what?* |
| Event sourcing / boldsea | event | append-only | causal only | no | *what happened, in what order?* |
| REA (accounting) | resource / event / agent | balances to zero | **dual pairs** | exchange-value | *what was exchanged?* |
| DEMO (Dietz) | transaction (C/P acts) | completes on accept | bilateral | commitment | *who committed to produce what?* |
| Blockchain / smart contract | transaction | **irreversible** | **symmetric transfer** | price | *how to transact **without** trust?* |
| **gift-onto** | **gift act** | **irreversible** | **asymmetric** | **moral weight** | ***what was given, whom does it bind, what grew?*** |

The sharpest contrast is with blockchain: **both are irreversible ledgers, with opposite purposes.** Blockchain makes transfer possible *without* trust. `gift-onto` makes trust *accumulate*. One removes the person; the other is built on persons.

Full treatment: **[docs/COMPARISON.md](docs/COMPARISON.md)**.

---

## Documentation

- **[docs/ONTOLOGY.md](docs/ONTOLOGY.md)** — the ontology in full: primitives, axioms, the matrix W, anamnesis, surplus.
- **[docs/COMPARISON.md](docs/COMPARISON.md)** — gift vs every neighbouring ontology, with the formal reduction *transaction = gift + mandatory counter-act + rollback*.
- **[docs/WHY.md](docs/WHY.md)** — why this had to be built: the four-property gap and the trust problem for AI agents.
- **[docs/FOUNDATION.ru.md](docs/FOUNDATION.ru.md)** — the conceptual source, unabridged (Russian). `gift-onto` is *theologically motivated*; you don't need to share the frame to use it, and we don't hide it.

---

## Repository layout

```
src/
├── core/        — GiftAct, GiftMemory (matrix W), GiftEngine, event bus, ledger, validator
├── persons/     — Person, AgentPerson, PersonRegistry
├── memory/      — anamnesis (append-only), liturgical clock, sabbath, epoch gate
├── theology/    — value semantics: energy/essence split, freedom guard, restoration, apophasis
├── oikonomia/   — economy: perichoresis cycle, jubilee, koinon (shared recipient), offering
├── traces/      — gratitude graph, gift traces
├── social/      — theosis, theory-of-mind, mimesis, credit assignment
└── types/       — TypeScript definitions + gift-act JSON schema
specs/           — 200+ .gift specifications (the conceptual library)
```

> Module names in `theology/` / `oikonomia/` name the *source*; they implement plain mechanisms — energy-vs-essence = observable-behaviour-vs-unknowable-internal-state; jubilee = periodic debt reset; perichoresis = co-presence without ordering.

---

## License

**MIT.** Take it, change it, sell it. The only request, in the spirit of the thing: if you use it, record the act in your own matrix `W`.

> *«Даром получили — даром давайте»* — freely you received, freely give.
