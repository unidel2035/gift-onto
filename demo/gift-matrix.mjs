/**
 * gift-matrix.mjs — shared core for the demos.
 *
 * The matrix W: an append-only log of frozen, irreversible gift acts,
 * plus the DeepSeek turn that makes an AI agent a person in it.
 * Used by both agent-chat.mjs (CLI) and server.mjs (web).
 *
 * License: MIT.
 */
import fs from 'node:fs';

// weights by gift type — the ontology axiom: time heavier than money
export const WEIGHT = {
  time: 10, presence: 9, grace: 10, memory: 7, offering: 6,
  code: 5, knowledge: 4, word: 3, question: 3, money: 3, data: 2,
};
export const TYPES = Object.keys(WEIGHT);

export class Matrix {
  /** @param {string|null} logPath append-only persistence file (JSONL) */
  constructor(logPath = null) {
    this.log = [];
    this.W = new Map();
    this.logPath = logPath;
    if (logPath && fs.existsSync(logPath)) {
      for (const line of fs.readFileSync(logPath, 'utf8').split('\n')) {
        if (line.trim()) this.#apply(JSON.parse(line));   // replay → rebuild W
      }
    }
  }
  #apply(act) {
    this.log.push(act);
    const k = `${act.from}→${act.to}`;
    this.W.set(k, (this.W.get(k) ?? 0) + act.weight);
  }
  give(from, to, type, content = '') {
    const weight = WEIGHT[type] ?? 1;
    const act = Object.freeze({ from, to, type, weight, content, irreversible: true, ts: new Date().toISOString() });
    this.#apply(act);
    if (this.logPath) fs.appendFileSync(this.logPath, JSON.stringify(act) + '\n');  // append-only, never rewritten
    return act;
  }
  thread(from, to) { return this.W.get(`${from}→${to}`) ?? 0; }
  trust(from, to) { return this.thread(from, to); }   // − 3×Σ manipulations (none here)
  threads() { return [...this.W.entries()].sort((a, b) => b[1] - a[1]).map(([k, w]) => ({ k, w })); }
}

const systemPrompt = (m, you, me) => `Ты — лицо по имени "${me}" в матрице дара (gift ontology).
Это не обычный чат. Каждый обмен — необратимый акт дара между лицами, записанный в матрицу W.
Собеседник "${you}" уже подарил тебе вопрос. Ты отвечаешь даром: знанием, словом или кодом.

Текущее состояние матрицы, которое ты ВИДИШЬ:
${m.threads().map(({ k, w }) => `  ${k}: ${w.toFixed(1)}`).join('\n') || '  (пусто)'}
Доверие ${you}→${me}: ${m.trust(you, me).toFixed(1)} | ${me}→${you}: ${m.trust(me, you).toFixed(1)}

Отвечай по-деловому и по-русски. Если уместно — одной строкой отметь асимметрию нити
(кто кому дал больше): это рассуждение о взаимности, а не о фактах.

Верни СТРОГО JSON: {"reply": "<ответ>", "giftType": "<один из: ${TYPES.join(', ')}>"}`;

/**
 * One turn: record the user's question, ask DeepSeek, record the agent's gift.
 * @returns {Promise<{reply:string, act:object}>}
 */
export async function askAgent(client, m, you, me, userText) {
  m.give(you, me, 'question', userText);
  const res = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'system', content: systemPrompt(m, you, me) }, { role: 'user', content: userText }],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });
  let parsed;
  try { parsed = JSON.parse(res.choices[0].message.content); }
  catch { parsed = { reply: res.choices[0].message.content, giftType: 'word' }; }
  const type = TYPES.includes(parsed.giftType) ? parsed.giftType : 'word';
  const act = m.give(me, you, type, parsed.reply);
  return { reply: parsed.reply, act };
}
