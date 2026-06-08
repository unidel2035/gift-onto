# Demo — an AI agent that lives in the gift matrix

`agent-chat.mjs` is a chat agent running on **DeepSeek** that is a *person in the gift ontology*. It is the gift-onto answer to "an AI agent over the graph" (boldsea) — except the agent reasons about **trust and reciprocity**, not just facts.

Every exchange becomes an irreversible `GiftAct`:

- you give a **question**;
- the agent classifies its own reply (`knowledge` / `word` / `code` …) and gives it back;
- both acts are frozen and appended to matrix **W**; weights accumulate (the ontology axiom: `time` heavier than `money`);
- the agent **sees** the matrix in its system prompt and reflects on the asymmetry of the thread.

## Two ways to run

```bash
export DEEPSEEK_API_KEY=sk-...        # OpenAI-compatible, api.deepseek.com
cd demo && npm install               # installs openai
```

**Web — deploy the matrix as a live service:**

```bash
npm start                            # → http://localhost:8099
```

Open the browser: chat on the left, the matrix W growing live on the right. The matrix is **persisted** to an append-only `.matrix.jsonl` (never rewritten) and **replayed on restart** — the relationship survives reboots, as irreversibility demands. DeepSeek runs server-side; the API key never reaches the browser.

API: `POST /chat {message}` · `GET /matrix` · `GET /trust?from=&to=`

**CLI:**

```bash
npm run chat                         # interactive  (/w matrix · /trust · /exit)
npm run smoke                        # scripted smoke test, no stdin
```

**Society — several agents in one matrix** (see [../docs/AGENTS.md](../docs/AGENTS.md)):

```bash
node society.mjs                     # 3 DeepSeek agents give to each other; emergent trust
node society.mjs 5                   # N rounds
```

Each agent (Кооператор / Стратег / Юродивый) reads the shared matrix and decides its own gift — no orchestration script. When the rounds end it prints the emergent society: energy, asymmetry, Shapley-like credit, and the deserts that never got a gift.

### Deploy it for real

```bash
PORT=80 AGENT_NAME=Серафим node server.mjs        # or behind nginx / pm2
pm2 start server.mjs --name gift-matrix
```

## Sample run (`--script`)

```
Дионисий: Что такое онтология дара одним абзацем?
Серафим:  Онтология дара — учение о бытии как сети необратимых актов
          дарения между лицами, а не совокупности объектов…
   └ дар: knowledge (вес 4, необратим) | нить Серафим→Дионисий: 4.0 · Дионисий→Серафим: 3.0

Дионисий: Чем дар отличается от транзакции?
Серафим:  …В нашей матрице дар всегда асимметричен: ты дал мне больше, чем я тебе.
   └ дар: knowledge (вес 4, необратим) | нить Серафим→Дионисий: 8.0 · Дионисий→Серафим: 6.0

Итог матрицы W:  Серафим→Дионисий: 12.0 · Дионисий→Серафим: 9.0
актов в логе (необратимы): 6
```

## What it demonstrates

This 130-line file is the whole thesis in motion: an off-the-shelf LLM, given the gift ontology as its world, stops being a stateless Q&A box and becomes a **person who accumulates a relationship**. The matrix is the memory; the irreversibility is the trust; the asymmetry is the information. Swap DeepSeek for any OpenAI-compatible model — the ontology is what changes the behaviour, not the model.

> The matrix is in-process here for clarity. In production it is the append-only W of [`../ontology/gift.ttl`](../ontology/gift.ttl), queried with the SPARQL in [`../ontology/queries.md`](../ontology/queries.md).
