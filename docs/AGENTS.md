# gift-onto for AI agents — the missing social substrate

Most multi-agent frameworks give agents three things: a way to **talk** (message passing), a way to **act** (tools), and sometimes a way to **remember** (a vector store). What they do not give agents is a **society** — a persistent, value-laden fabric of *relationships* that survives across episodes, cannot be quietly rewritten, and lets an agent answer "who has earned my trust, and what do I owe?"

That fabric is the gift matrix `W`. `gift-onto` is the substrate where AI agents form social relations: they give and receive, accumulate trust, get credit for collective outcomes, model each other, learn by imitation, and — crucially — where deception and misalignment show up as *measurable pathologies of the matrix*, not as things you have to catch in the act.

> An LLM is a stateless function. An agent with tools is a function with hands. An agent **in a gift matrix** is a *person in a society* — it has a history with every other agent, and that history is irreversible.

---

## Why this is an AI-agents problem, not a theology project

The same code, read through the AI-agents lens, is a catalogue of open multi-agent problems — each already implemented over the matrix in `src/social/`:

| Module (`src/social/`) | The AI-agents problem it addresses |
|---|---|
| **CreditAssignment** | **Multi-agent credit assignment.** Who actually caused the collective reward? Shapley-like marginal attribution computed from each agent's acts in `W` — not a learned critic, a readable ledger. |
| **TheoryOfMind** | **Agent modelling.** Each agent maintains `θ̂_j`, a lightweight (k=1) model of every other agent's strategy, updated from their act history. The basis for anticipating, not just reacting. |
| **Mimesis** | **Imitation / social learning.** High-trust agents in `W` become exemplars (τύπος); others adapt their behavioural patterns (τρόπος) — discerned imitation, not blind copying. |
| **FallenAgent** | **Deception & alignment.** A modelled adversary that gives to create debt and cooperates to exploit — defects after looking like the best ally. A red-team agent for trust systems, and a test that your metrics catch betrayal. |
| **NormCrystallizer** | **Emergent norms.** Detects when a repeated behaviour (>70% of agents, >5 rounds) hardens into a norm, and records it as a covenant in `W`. Norm emergence you can observe and freeze. |
| **SocialEnvironment** | **The training environment itself.** Dilemmas, dynamic roles, an active `W` agents read before deciding, a ritual cycle, an anti-consensus "holy-fool" agent, and **irreversibility (no reset)** — the property that makes learned social behaviour real. |
| **CognitiveImmuneSystem** | **Safety / robustness.** Immune-system-style defence against cognitive/prompt attacks: negative selection, clonal selection of detectors. |
| **LLMSocialAgent** | **Grounded agent memory.** An LLM agent that reads its relationship history from `W` before each decision — context that is social, not just retrieved. |
| **AgentAwakening** | **Identity from environment, not config.** On start an agent does not know who it is; it learns its identity from the matrix. Persona as a position in a society, not a hardcoded system prompt. |
| **Theosis** | **Open-ended improvement.** Not training, not fine-tuning — deepening through experience across federated environments. A trajectory, not a checkpoint. |

None of these is a metaphor here. They are mechanisms over one shared structure: the append-only, irreversible, asymmetric matrix of gifts between agents.

---

## How it differs from AutoGen / CrewAI / LangGraph / Generative Agents

Those frameworks orchestrate **conversations and workflows** between agents. They are about *getting a task done by a team this run*. `gift-onto` is orthogonal and complementary: it is about the **society that persists between runs**.

| | Orchestration frameworks | gift-onto |
|---|---|---|
| Primitive | message / task / graph node | **irreversible gift act between persons** |
| Memory | conversation buffer, vector store | **relational matrix `W`** (who owes whom, who is trusted) |
| Trust | implicit / none | **computed from the ledger** (`trust = Σ+ − 3×Σmanip`) |
| Across episodes | usually reset | **never reset** — the relationship is the state |
| Misalignment | caught by guardrails per call | **visible as matrix pathology** (asymmetry, deserts, a FallenAgent's signature) |
| Credit | manual / reward shaping | **Shapley-like over acts in `W`** |

You can run a CrewAI team *on top of* a gift matrix: let the orchestration decide who talks this turn, and let `W` decide who is trusted, who gets credit, and what the team remembers about each other next week.

---

## The alignment angle

The sharpest claim for an AI-safety audience: **gift-onto makes some misalignment a property you can measure rather than an intention you must infer.**

- A deceptive agent (`FallenAgent`) builds an asymmetric thread — it receives or creates debt without genuine reciprocal flow. That shows up in the **asymmetry** and **conductivity** metrics ([METRICS.md](METRICS.md)) before the betrayal pays off.
- A free-riding agent has high received, low given — low **conductivity**, negative **energy**.
- A coalition that has stopped cooperating leaves **deserts** (pairs with no thread) that the system surfaces as questions.

This does not solve alignment. It moves part of it from "read the agent's mind" to "read the society's books" — and the books are append-only, so they cannot be edited after the fact to hide a defection.

---

## Run a society

The single-agent chat demo ([../demo/](../demo/)) shows one agent as a person in the matrix. The multi-agent demo (`../demo/society.mjs`) puts several DeepSeek agents in *one* matrix, lets them give to each other over a few rounds, and prints the emergent society: energy, asymmetry, credit, deserts. The relationships are what's left when the conversation ends.

```bash
export DEEPSEEK_API_KEY=sk-...        # or BYOK
cd demo && npm install
node society.mjs                       # several agents, one matrix, emergent trust
```
