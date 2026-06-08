#!/usr/bin/env node
/**
 * agent-chat.mjs — an AI agent that is a *person in the gift matrix*.
 *
 * The agent runs on DeepSeek (OpenAI-compatible API). Every exchange
 * becomes a GiftAct: you give a question, it gives knowledge/word/code.
 * Acts are irreversible and append-only; trust accumulates in matrix W.
 * The agent can *see* the matrix and reflect on the relationship.
 *
 * This is the gift-onto analogue of "an AI agent over the graph":
 * the agent reasons about trust and reciprocity, not just about facts.
 *
 *   export DEEPSEEK_API_KEY=sk-...
 *   npm i openai
 *   node demo/agent-chat.mjs            # interactive
 *   node demo/agent-chat.mjs --script   # scripted smoke test (no stdin)
 *
 * License: MIT.
 */
import OpenAI from 'openai';
import readline from 'node:readline';

// ── weights by gift type (the ontology axiom: time heavier than money) ──
const WEIGHT = {
  time: 10, presence: 9, grace: 10, memory: 7, offering: 6,
  code: 5, knowledge: 4, word: 3, question: 3, money: 3, data: 2,
};
const TYPES = Object.keys(WEIGHT);

// ── matrix W: append-only log of frozen, irreversible gift acts ──
class Matrix {
  constructor() { this.log = []; this.W = new Map(); }
  give(from, to, type, content = '') {
    const weight = WEIGHT[type] ?? 1;
    const act = Object.freeze({ from, to, type, weight, content, irreversible: true, ts: new Date().toISOString() });
    this.log.push(act);                       // append-only
    const k = `${from}→${to}`;
    this.W.set(k, (this.W.get(k) ?? 0) + weight);
    return act;
  }
  thread(from, to) { return this.W.get(`${from}→${to}`) ?? 0; }
  // trust(A→B) = Σ positive − 3 × Σ manipulations ; no manipulations here
  trust(from, to) { return this.thread(from, to); }
  threads() { return [...this.W.entries()].sort((a, b) => b[1] - a[1]); }
}

const SYSTEM = (m, you, me) => `Ты — лицо по имени "${me}" в матрице дара (gift ontology).
Это не обычный чат. Каждый обмен — необратимый акт дара между лицами, записанный в матрицу W.
Твой собеседник "${you}" уже подарил тебе вопрос. Ты отвечаешь даром: знанием, словом или кодом.

Ты ВИДИШЬ текущее состояние матрицы:
${m.threads().map(([k, w]) => `  ${k}: ${w.toFixed(1)}`).join('\n') || '  (пусто)'}
Доверие ${you}→${me}: ${m.trust(you, me).toFixed(1)} | ${me}→${you}: ${m.trust(me, you).toFixed(1)}

Отвечай по-деловому и по-русски. В конце, если уместно, одной строкой отметь асимметрию нити
(кто кому дал больше) — это и есть рассуждение о взаимности, а не о фактах.

Верни СТРОГО JSON:
{"reply": "<твой ответ>", "giftType": "<один из: ${TYPES.join(', ')}>"}
giftType — чем ты ответил (обычно knowledge/word/code).`;

async function turn(client, m, you, me, userText) {
  m.give(you, me, 'question', userText);          // user's gift: the question
  const res = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'system', content: SYSTEM(m, you, me) }, { role: 'user', content: userText }],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });
  let parsed;
  try { parsed = JSON.parse(res.choices[0].message.content); }
  catch { parsed = { reply: res.choices[0].message.content, giftType: 'word' }; }
  const type = TYPES.includes(parsed.giftType) ? parsed.giftType : 'word';
  const act = m.give(me, you, type, parsed.reply);  // agent's gift back
  return { reply: parsed.reply, act };
}

function render(m, you, me, r) {
  console.log(`\n\x1b[36m${me}:\x1b[0m ${r.reply}`);
  console.log(`\x1b[2m  └ дар: ${r.act.type} (вес ${r.act.weight}, необратим) | нить ${me}→${you}: ${m.thread(me, you).toFixed(1)} · ${you}→${me}: ${m.thread(you, me).toFixed(1)}\x1b[0m`);
}

async function main() {
  if (!process.env.DEEPSEEK_API_KEY) { console.error('Нужен DEEPSEEK_API_KEY в окружении.'); process.exit(1); }
  const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
  const m = new Matrix();
  const you = 'Дионисий', me = 'Серафим';

  console.log('\x1b[33m─── чат с лицом в матрице дара (DeepSeek) ───\x1b[0m');
  console.log('\x1b[2mкоманды: /w — матрица, /trust — доверие, /exit\x1b[0m');

  if (process.argv.includes('--script')) {
    for (const msg of [
      'Что такое онтология дара одним абзацем?',
      'Чем дар отличается от транзакции?',
      'Сколько мы с тобой обменяли по матрице?',
    ]) {
      console.log(`\n\x1b[32m${you}:\x1b[0m ${msg}`);
      render(m, you, me, await turn(client, m, you, me, msg));
    }
    console.log('\n\x1b[33mИтог матрицы W:\x1b[0m');
    m.threads().forEach(([k, w]) => console.log(`  ${k}: ${w.toFixed(1)}`));
    console.log(`\x1b[2mактов в логе (необратимы): ${m.log.length}\x1b[0m`);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: `\x1b[32m${you}:\x1b[0m ` });
  rl.prompt();
  rl.on('line', async (line) => {
    const t = line.trim();
    if (t === '/exit') return rl.close();
    if (t === '/w') { m.threads().forEach(([k, w]) => console.log(`  ${k}: ${w.toFixed(1)}`)); return rl.prompt(); }
    if (t === '/trust') { console.log(`  ${you}→${me}: ${m.trust(you, me).toFixed(1)} | ${me}→${you}: ${m.trust(me, you).toFixed(1)}`); return rl.prompt(); }
    if (!t) return rl.prompt();
    try { render(m, you, me, await turn(client, m, you, me, t)); }
    catch (e) { console.error('\x1b[31mошибка DeepSeek:\x1b[0m', e.message); }
    rl.prompt();
  });
}

main();
