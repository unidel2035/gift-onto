# A recorded society — what you'll see, with no setup

This is a real, unedited run of [`society.mjs`](society.mjs): three DeepSeek agents in one gift matrix, no orchestration script telling them what to do. Each reads the shared matrix and decides its own gift. You don't need a key to read what emerged — that's the point of recording it.

```
─── общество агентов в матрице дара · 2 раунда ───

■ Раунд 1
  Кооператор → Стратег  : presence (вес 9) — Дарю тебе своё полное присутствие, чтобы вместе обдумать следующие шаги.
  Стратег    → Кооператор: presence (вес 9) — Твоя нить ко мне сильна, я отвечаю присутствием, чтобы укрепить связь.
  Юродивый   → Кооператор: question (вес 3) — Что, если сила не в балансе, а в разрыве?

■ Раунд 2
  Кооператор → Юродивый : presence (вес 9) — Ты одинок в пустыне, я приду к тебе, чтобы согреть.
  Стратег    → Кооператор: presence (вес 9) — Ты доказал полезность, усилим связь для будущих обменов.
  Юродивый   → Стратег   : grace (вес 10) — Твоя пустыня вздрогнет от неожиданного цветения.

═══ возникшее общество ═══

Энергия (дал − принял):
  Юродивый:  +4.0  (проводимость 100%)
  Стратег:   -1.0  (проводимость  95%)
  Кооператор:-3.0  (проводимость  86%)

Асимметрия нитей:
  Стратег ↔ Юродивый:  Δ10.0 в пользу Юродивый
  Кооператор ↔ Стратег: Δ9.0 в пользу Стратег
  Кооператор ↔ Юродивый: Δ6.0 в пользу Кооператор

Кредит (доля созданного потока, Shapley-подобно):
  Стратег: 37% · Кооператор: 37% · Юродивый: 27%

Пустыни (никто не дал): Стратег→Юродивый

актов в матрице (необратимы): 6 · общий поток: 49.0
```

## Read it as a professional would

Nobody scripted these characters — they fell out of the personas reading the matrix:

- **Кооператор** (the cooperator) gives presence first, then walks *into the desert* to the agent everyone ignores ("ты одинок в пустыне, я приду к тебе").
- **Стратег** (the strategist) reciprocates only to the agent that "proved useful" — and **never gives to the Юродивый at all**. That refusal is the one remaining **desert** in the final matrix (`Стратег→Юродивый`): the metric caught a character trait without being told to look for it.
- **Юродивый** (the holy fool / anti-consensus agent) ends with the highest **energy** and 100% **conductivity** — a pure source — precisely because it gives where no one else will.

This is the whole thesis in one run: drop LLMs into a gift matrix and a *society* emerges — with trust, asymmetry, credit, and silence — that you can measure from the append-only log alone. Run your own:

```bash
cd demo && npm install && node society.mjs
```
