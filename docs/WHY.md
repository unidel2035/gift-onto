# Why this ontology had to exist

A new ontology is a debt you take on. You should only build one if no existing ontology can be bent to the job. This document states the job, shows that the existing ontologies cannot do it, and names what changed to make the job urgent.

## The job: a memory that lets a system accumulate trust

The driving problem is concrete: **autonomous AI agents that cooperate over time need a shared memory of their relationships — and that memory has to support trust.** Not trust as a vibe; trust as a computable property: *given everything A has done for and to B, how much should B rely on A?*

For a memory to support trust, it must have four properties at once:

1. **Irreversibility.** If A can quietly rewrite what they did, the record is worthless. You cannot trust a ledger that forgets. The memory must be append-only and its records frozen.

2. **Asymmetry.** Trust is directional and unequal. "A gave B ten hours" is not the same fact as "B gave A ten dollars," and it is not the same as "B gave A ten hours." The direction and the imbalance *are* the signal. A memory that nets these to zero has erased the very thing trust is computed from.

3. **Native value.** The worth of an act must live in the data, not in an external rules engine. If goodness is decided by a separate policy module, then the policy module — not the relationship — is the source of truth, and it can be swapped, gamed, or disagreed with. The memory should let you compute `trust` *directly from the log* (here: `Σ positive − 3 × Σ manipulations`). Ethics as the weight of threads, not as a list of rules.

4. **Surplus.** Cooperation that only ever conserved would not be worth modelling beyond bookkeeping. The interesting fact about a gift is that it can produce more than was put in — the recipient is changed, the network is enriched. A memory that assumes conservation cannot represent the one thing that makes cooperation generative.

## Why no existing ontology does the job

Each neighbour has *some* of the four, none has all (full argument in [COMPARISON.md](COMPARISON.md)):

| | irreversible | asymmetric | native value | surplus |
|---|---|---|---|---|
| RDF / schema.org | — | — | — | — |
| PROV-O | descriptive | ✓ | — | — |
| Event sourcing / boldsea | ✓ | causal only | — | — |
| REA | — | dual (cancels) | exchange-price | — (conserves) |
| DEMO | — | bilateral | commitment | — |
| Blockchain | ✓ | symmetric transfer | price | — (conserves) |

The two that have irreversibility — event sourcing and blockchain — lack native value and (for blockchain) deliberately remove the person. The two richest on obligation — REA and DEMO — are built on conservation and a mandatory counter-act, which destroy asymmetry and forbid surplus. Provenance is the closest in shape but is committed to neutrality: it will tell you what happened, never whether it was owed or freely given.

So the four properties are not co-located anywhere. You cannot get them by configuring an existing ontology, because each missing property is not an omission but a *design commitment in the opposite direction*: REA is *committed* to balancing; blockchain is *committed* to trustlessness; PROV is *committed* to neutrality. To get all four you have to start from a different atom. That atom is the gift.

## Why now

Two things changed that turned a philosophical point into an engineering need:

- **Multi-agent AI.** When the actors are autonomous agents, not just humans with intuitions, the relationship layer has to be *explicit and computable*. A human community carries trust implicitly; a swarm of agents needs it in the data. The memory of who-gave-what-to-whom stops being optional.
- **Irreversible-ledger technology became ordinary.** Append-only logs, content addressing, and immutable stores are now commodity infrastructure. The substrate the gift ontology needs — irreversibility you can rely on — used to be exotic; now it is a library. So the only remaining question is *what you record on it*: neutral events (boldsea), trustless transfers (blockchain), or valued gifts (this).

## What question it answers — in one line

> *How does a community of persons and agents remember what it has given, so that trust can accumulate and cooperation can produce more than it costs?*

Object ontologies answer *what is*. Event ontologies answer *what happened*. Transaction ontologies answer *what was exchanged*. None of them answers *what was given, whom it binds, and what grew beyond the exchange*. That question is the reason this exists.

## The honest caveat

The ontology models the **trace** of a gift, not the gift itself. The actual gift happens between persons and is not fully reducible to a record — the system witnesses, it does not reproduce. We hold this as a feature, not a bug: it keeps the model from over-claiming. The source of that humility, and of the four axioms, is a specific theological reading of the gift, set out in [FOUNDATION.ru.md](FOUNDATION.ru.md). You do not have to share it to use the ontology — but you should know it is there, because it is *why* the axioms are what they are.
