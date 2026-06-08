# The gift ontology

This document defines the ontology in full: its primitives, its axioms, and the structures that follow from them.

It is written for an engineer or a researcher. Where a concept has a theological source, that source is named in passing — but every claim here is meant to stand as a plain modelling decision you can verify in the code, not as something you must believe. The operational test of reality in this ontology is one question: **does the gift flow?**

---

## 1. The problem of the primitive

Every ontology begins by choosing an atom.

- Choose the **thing** (object), and you get databases, RDF, schema.org — good at *what is*, blind to *what happens*.
- Choose the **event**, and you get event sourcing and boldsea-style temporal graphs — good at *what happened and in what causal order*, but the event is value-neutral: it does not know whether what happened was good, owed, or free.
- Choose the **transaction**, and you get REA and DEMO — good at *balanced exchange*, but the transaction conserves: it must net to zero, and it is reversible in principle (you can refund, roll back, cancel).

None of these atoms can carry the thing a cooperating system most needs to remember: a **relationship that obligates and cannot be undone.** So `gift-onto` chooses a different atom.

> **The atom is the gift act:** a *directed*, *asymmetric*, *irreversible* transfer of value *between persons*, which may produce *surplus*.

Everything else in the ontology is a consequence of this choice.

---

## 2. Primitives

### 2.1 Person

A **Person** is a named locus of acts — a human, an agent, an institution, an anonymous source (`_abyss`, from which acts arrive without an attributable giver), or the shared recipient (`_koinon`, the commons).

A Person is *not* an object and *not* a row. It is irreducible: the ontology never decomposes a person into attributes, because the unit of moral reality is the person, not their properties. (Source: the patristic distinction of *hypostasis* from *ousia* — the person is known by their acts/energies, never by an exhaustive description of essence. In the code: `ousia` is always `null`, by design.)

### 2.2 GiftAct

```
GiftAct = (from: Person, to: Person, what, weight: number, irreversible: true, telos)
```

A **GiftAct** is the atom. Once created it is **frozen** (`Object.freeze`) and flagged `irreversible: true`. It has:

- a **direction** (`from → to`) — giving and receiving are different events, not two views of one;
- a **weight** — its moral/relational magnitude (see §3.2);
- a **telos** — what it is *for*; an act whose telos does not serve the recipient fails `TelosCheck`;
- optionally a **return movement** (`gratitude`) — which is *free*, never an obligation that completes the act.

Crucially, a GiftAct **completes at the moment of giving.** Acceptance by the recipient is their freedom (`eleutheria`), not a precondition for the act to count. This is the formal break with the transaction, where nothing completes until both sides agree.

### 2.3 Matrix W

The **matrix W** is the relational tensor: a weighted, directed, append-only graph whose edges are the accumulated weight of gift acts between each ordered pair of persons. `W[A][B]` ≠ `W[B][A]` in general — the asymmetry is first-class.

W is the system's memory of *relationship*. It is never overwritten; new acts add to it. A snapshot of W is a tensor of weights; the texts of the acts live alongside it.

### 2.4 Anamnesis

**Anamnesis** is the memory model: an append-only log in which past acts remain *present* and queryable. It is not an archive (a place the past is filed away) but a making-present: `makePresent()` brings a past act back into the active context of decision. (Source: liturgical *anamnesis* — remembrance that re-presents rather than merely recalls.)

### 2.5 Surplus

**Surplus** is the non-conserved remainder of a gift: result minus input, when result is greater. The ontology does not require conservation. A gift can leave both giver and the network richer than the sum put in. This is the single property that most sharply separates it from every accounting/transaction ontology, all of which conserve.

---

## 3. Axioms

These are load-bearing. Remove any one and the ontology collapses into one of its neighbours.

### 3.1 Irreversibility

> A recorded act cannot be reversed, edited, or deleted. The log is append-only; acts are frozen.

*Why it matters:* trust is impossible against a memory that can be quietly rewritten. Irreversibility is what makes the ledger a witness. (Note: blockchain shares this axiom — and only this one. See COMPARISON.)

Remove it → you get an ordinary event log or a mutable database.

### 3.2 Asymmetry of value (weight)

> Acts carry weight, and weight is not symmetric. By default **time weighs more than money** (10 vs 3). Weights are a configurable axiom of the kernel, not a hardcode.

*Why it matters:* this is where **ethics lives as data, not as rules.** The system does not consult an external policy engine to decide what is good; goodness is the accumulated weight of acts in W. Morality is the geometry of the matrix.

Remove it → you get a value-neutral event ontology.

### 3.3 Personhood

> Acts run between persons, who are irreducible. The graph is a graph *of persons*, not of objects or transactions.

*Why it matters:* trust is a property of a relationship between persons, not of a resource flow. PROV-O has agents but treats them descriptively; gift-onto makes the person the bearer of moral weight.

Remove it → you get REA (resources flowing between agents-as-endpoints).

### 3.4 Non-conservation (surplus)

> The result of a gift may exceed its input.

*Why it matters:* if cooperation only ever conserved, there would be nothing to model beyond bookkeeping. Surplus is why the gift is generative and the transaction is not.

Remove it → you get accounting (everything nets to zero).

### 3.5 Freedom

> Acceptance and gratitude are free. The act completes on giving; the response is never coerced and never a completion condition.

*Why it matters:* a "gift" that obligates a return is a trade. The freedom of the recipient is what keeps the act a gift. (Source: *eleutheria*.)

Remove it → you get DEMO/Dietz (transaction completes only on bilateral `accept`).

---

## 4. Derived structures

From the five axioms the rest follows:

- **GratitudeGraph** — the subgraph of return movements; trust flows back along it.
- **Jubilee** — periodic reset of accumulated debt/imbalance, preventing the matrix from ossifying.
- **Koinon** — the shared recipient: acts given to the commons rather than to an individual.
- **Perichoresis cycle** — co-presence of persons without ordering; mutual indwelling of acts.
- **Desert detection** — regions of W with no threads (silence), fading threads (weight → 0), or pathological asymmetry (> 15:1); the system surfaces these as questions to be answered by new gifts.
- **Theosis** — cumulative deepening of a recipient over time (+0.01 per cycle in the reference implementation): the recipient is changed by what they receive.

---

## 5. The reduction theorem (informal)

The neighbouring ontologies are **degenerate cases** of the gift:

```
transaction  = gift + mandatory counter-act + rollback        (REA, DEMO, ACID)
event        = gift − direction − weight − person              (event sourcing, boldsea)
object/state = gift collapsed to its result, losing the act    (RDF, schema.org)
```

That is the claim `gift-onto` stakes: not that it competes with these, but that it sits **underneath** them. A transaction is a gift from which someone demanded a counter-movement and permitted a rollback. Strip the demand and the rollback, and the transaction *is* a gift again.

This claim is falsifiable: if a neighbouring ontology already carries a signed, asymmetric, irreversible value between persons with surplus, the reduction fails and the claim should be dropped. As of writing, none does.

---

## 6. What this is honest about

The code models the **trace** of a gift, not the gift itself. A gift happens between persons; a system can witness its trace but cannot reproduce its source. This is not a limitation to be engineered away — it is the boundary the ontology respects. `ousia` is `null`. The mode of reality here is energy (*energeia*), the observable flow — never essence.

The full source of these ideas is in [FOUNDATION.ru.md](FOUNDATION.ru.md).
