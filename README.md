# gift-onto — a persistent trust fabric for multi-agent AI

[![ci](https://github.com/unidel2035/gift-onto/actions/workflows/ci.yml/badge.svg)](https://github.com/unidel2035/gift-onto/actions/workflows/ci.yml) · [watch a recorded society (no setup)](demo/society.sample.md)

> The social substrate agents are missing: an **irreversible, asymmetric ledger of who-gave-what-to-whom**, where trust accumulates between runs, credit is assigned from the record, and deception is a *measurable pathology of the matrix* — not an intention you have to infer.

Multi-agent frameworks — AutoGen, CrewAI, LangGraph — give agents a way to **talk** (messages), **act** (tools), and **remember** (a vector store). None gives them a **society**: a durable fabric of *relationships* that persists between episodes and lets an agent answer *"who has earned my trust, and what do I owe?"*

`gift-onto` is that fabric. Its primitive is the **gift act** — a directed, weighted, irreversible transfer of value between persons. Agents give and receive; the **matrix `W`** accumulates who-gave-what-to-whom; trust, credit, theory-of-mind, imitation, and emergent norms all compute over one shared, append-only structure.

> An LLM is a stateless function. An agent with tools has hands. An agent **in a gift matrix** is a *person in a society* — with an irreversible history with every other agent.

```bash
cd demo && npm install
export DEEPSEEK_API_KEY=sk-...                  # or bring-your-own-key in the web UI
node society.mjs        # several DeepSeek agents in one matrix → emergent trust
npm start              # web: a single agent + the live matrix, http://localhost:8099
```

---

## Why agents need a trust fabric

Trust is not a vibe; it is a computable property of a record — *given everything A has done for and to B, how much should B rely on A?* For a memory to support it, it needs four properties at once, and no mainstream agent memory has all four:

1. **Irreversibility** — you cannot trust a record that can be quietly rewritten. Acts are frozen, the log append-only.
2. **Asymmetry** — "A gave B ten hours" ≠ "B gave A ten dollars." The direction and the imbalance *are* the signal; a memory that nets them to zero erases what trust is computed from.
3. **Native value** — worth lives in the data (`time` heavier than `money`), so `trust` is computed *from the log*, not from an external policy module that can be swapped or gamed. Ethics as the weight of threads.
4. **Surplus** — cooperation can produce more than its inputs; the recipient is changed. A memory that assumes conservation can't represent why cooperation is worth modelling.

`gift-onto` makes these four the axioms of its primitive. See **[docs/WHY.md](docs/WHY.md)**.

---

## The multi-agent layer — already built

`src/social/` implements the canonical multi-agent problems over the matrix `W`. This is not a roadmap; it is what's in the repo:

| Module | The multi-agent problem |
|---|---|
| **CreditAssignment** | Multi-agent credit assignment — Shapley-like marginal attribution from each agent's acts in `W` |
| **TheoryOfMind** | Agent modelling — each agent keeps `θ̂_j`, a model of every other's strategy, updated from act history |
| **Mimesis** | Imitation / social learning — high-trust agents become exemplars; others adapt their patterns |
| **FallenAgent** | Deception & alignment — an adversary that gives to create debt, cooperates to exploit, defects late |
| **NormCrystallizer** | Emergent norms — detects a behaviour hardening into a norm (>70% agents, >5 rounds), records it |
| **SocialEnvironment** | The training environment — dilemmas, dynamic roles, active `W`, an anti-consensus agent, **no reset** |
| **CognitiveImmuneSystem** | Safety — immune-style defence against cognitive / prompt attacks |
| **LLMSocialAgent** | Grounded memory — an LLM agent that reads its relationship history from `W` before deciding |
| **AgentAwakening** | Identity from environment, not config — an agent learns who it is from the matrix |

Full treatment, plus the comparison to AutoGen / CrewAI / LangGraph and the alignment angle: **[docs/AGENTS.md](docs/AGENTS.md)**.

---

## Deception as a measurable pathology

The sharpest claim for AI safety: `gift-onto` moves part of misalignment from *"read the agent's mind"* to *"read the society's books"* — and the books are append-only, so a defection can't be edited out after the fact.

- A deceptive agent builds an **asymmetric** thread — receives or creates debt without genuine reciprocal flow — visible before the betrayal pays off.
- A free-rider has high received, low given → low **conductivity**, negative **energy**.
- A coalition that stopped cooperating leaves **deserts** (pairs with no thread) the system surfaces as questions.

These metrics are live in the demo at `GET /metrics`. See **[docs/METRICS.md](docs/METRICS.md)**.

---

## How it differs from orchestration frameworks

They orchestrate **conversations and workflows this run**. `gift-onto` is the **society that persists between runs** — orthogonal and composable: run a CrewAI team *on top of* a gift matrix, and let `W` decide who is trusted, who gets credit, and what the team remembers about each other next week.

| | Orchestration (AutoGen/CrewAI/LangGraph) | gift-onto |
|---|---|---|
| Primitive | message / task / graph node | **irreversible gift act between persons** |
| Memory | conversation buffer / vector store | **relational matrix `W`** |
| Trust | implicit / none | **computed from the ledger** (`Σ+ − 3×Σmanip`) |
| Across episodes | usually reset | **never reset — the relationship is the state** |
| Misalignment | per-call guardrails | **visible as matrix pathology** |
| Credit | manual / reward shaping | **Shapley-like over acts in `W`** |

---

## The formal vocabulary

The matrix is grounded in a real, machine-readable ontology — **[`ontology/gift.ttl`](ontology/gift.ttl)** (OWL 2 / Turtle, aligned to W3C **PROV-O**), with **[SHACL shapes](ontology/gift.shacl.ttl)**, a **[JSON-LD context](ontology/gift-context.jsonld)**, and **[SPARQL competency questions](ontology/queries.md)**. Load it in Protégé or any reasoner. This is what makes `gift-onto` an ontology in the same sense as REA or PROV-O, not only a library.

---

## Foundations — why the primitive is a gift

The choice of *the gift* as the atom is not arbitrary; it is the more general act, from which exchange and event are degenerate cases:

```
transaction = gift + mandatory counter-act + rollback     (REA, DEMO, ACID)
event       = gift − direction − weight − person          (event sourcing, boldsea)
```

- **[docs/ONTOLOGY.md](docs/ONTOLOGY.md)** — the ontology in full: primitives, the five axioms, the matrix, anamnesis, surplus.
- **[docs/COMPARISON.md](docs/COMPARISON.md)** — gift vs. every neighbouring ontology (RDF, BFO, PROV-O, boldsea, REA, DEMO, blockchain, FIBO, Mauss) with the reduction theorem.
- **[docs/FOUNDATION.ru.md](docs/FOUNDATION.ru.md)** — the conceptual source, unabridged. `gift-onto` is *theologically motivated* (an Orthodox reading of the gift); you don't need to share the frame to use it, and we don't hide it. The axioms stand on their own — verified by behaviour, not belief. The operational test is one question: *does the gift flow?*

---

## Demos & layout

```
demo/        society.mjs (multi-agent) · server.mjs + web chat · agent-chat.mjs (CLI) · gift-matrix.mjs (core)
ontology/    gift.ttl (OWL) · gift.shacl.ttl · gift-context.jsonld · queries.md
docs/        AGENTS · METRICS · ONTOLOGY · COMPARISON · WHY · FOUNDATION.ru
src/         core/ persons/ memory/ theology/ oikonomia/ traces/ social/  — reference implementation
specs/       200+ .gift specifications (the project's own DSL)
```

## License

**MIT.** Take it, change it, sell it. The only request, in the spirit of the thing: if you use it, record the act in your own matrix `W`.
