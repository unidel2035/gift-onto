# Demo — an AI agent that lives in the gift matrix

`agent-chat.mjs` is a chat agent running on **DeepSeek** that is a *person in the gift ontology*. It is the gift-onto answer to "an AI agent over the graph" (boldsea) — except the agent reasons about **trust and reciprocity**, not just facts.

Every exchange becomes an irreversible `GiftAct`:

- you give a **question**;
- the agent classifies its own reply (`knowledge` / `word` / `code` …) and gives it back;
- both acts are frozen and appended to matrix **W**; weights accumulate (the ontology axiom: `time` heavier than `money`);
- the agent **sees** the matrix in its system prompt and reflects on the asymmetry of the thread.

## Run it

```bash
export DEEPSEEK_API_KEY=sk-...        # OpenAI-compatible, api.deepseek.com
npm i openai
node demo/agent-chat.mjs              # interactive  (/w matrix · /trust · /exit)
node demo/agent-chat.mjs --script     # scripted smoke test, no stdin
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
