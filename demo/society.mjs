#!/usr/bin/env node
/**
 * society.mjs — several AI agents in one gift matrix.
 *
 * A minimal society of DeepSeek agents that give to each other over a few
 * rounds. No orchestration script tells them what to do — each agent reads
 * the shared matrix W (who it trusts, who owes whom) and decides its own
 * gift. When the rounds end, the *relationships* are what's left: energy,
 * asymmetry, credit, deserts.
 *
 * This is the multi-agent face of gift-onto (see docs/AGENTS.md): the matrix
 * as the social substrate that persists between turns.
 *
 *   export DEEPSEEK_API_KEY=sk-...
 *   npm i openai
 *   node society.mjs            # default 3 rounds
 *   node society.mjs 5          # N rounds
 *
 * License: MIT.
 */
import OpenAI from 'openai';
import { Matrix, WEIGHT, TYPES } from './gift-matrix.mjs';

const AGENTS = [
  { id: 'Кооператор', persona: 'Ты щедр и строишь доверие. Даёшь первым, помнишь добро.' },
  { id: 'Стратег',    persona: 'Ты расчётлив. Даёшь тем, кто полезен, и моделируешь намерения других (теория разума).' },
  { id: 'Юродивый',   persona: 'Ты антиконсенсусный. Даёшь неожиданно, тем, кого все обходят (пустыням), нарушая равновесие.' },
];

const decidePrompt = (m, self) => {
  const others = AGENTS.filter(a => a.id !== self.id).map(a => a.id);
  const mx = m.metrics();
  const myThreads = others.map(o => `  ${self.id}→${o}: ${m.thread(self.id, o).toFixed(1)} | ${o}→${self.id}: ${m.thread(o, self.id).toFixed(1)}`).join('\n');
  return `Ты — агент "${self.id}" в матрице дара. ${self.persona}
Другие лица: ${others.join(', ')}.

Твои нити сейчас:
${myThreads || '  (пусто)'}
Пустыни (пары без единого дара): ${mx.deserts.map(d => d.from + '→' + d.to).join(', ') || 'нет'}

Сделай ОДИН дар одному из: ${others.join(', ')}.
Виды дара и их вес: ${TYPES.map(t => `${t}(${WEIGHT[t]})`).join(', ')}.
Реши, исходя из своего характера и состояния матрицы. Время/присутствие тяжелее денег.

Верни СТРОГО JSON: {"to":"<имя>","giftType":"<вид>","message":"<одна фраза почему>"}`;
};

async function decide(client, m, self) {
  const res = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'system', content: decidePrompt(m, self) }, { role: 'user', content: 'Твой ход.' }],
    response_format: { type: 'json_object' }, temperature: 0.8,
  });
  let p; try { p = JSON.parse(res.choices[0].message.content); } catch { return null; }
  const to = AGENTS.find(a => a.id === p.to && a.id !== self.id)?.id;
  const type = TYPES.includes(p.giftType) ? p.giftType : 'word';
  if (!to) return null;
  return { to, type, message: p.message || '' };
}

// Shapley-like credit: each agent's share of total positive flow it created
function credit(m) {
  const mx = m.metrics();
  const totalGiven = mx.persons.reduce((s, p) => s + p.given, 0) || 1;
  return mx.persons.map(p => ({ id: p.id, share: p.given / totalGiven })).sort((a, b) => b.share - a.share);
}

async function main() {
  if (!process.env.DEEPSEEK_API_KEY) { console.error('Нужен DEEPSEEK_API_KEY.'); process.exit(1); }
  const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' });
  const rounds = parseInt(process.argv[2], 10) || 3;
  const m = new Matrix();

  console.log(`\x1b[33m─── общество агентов в матрице дара · ${rounds} раунда ───\x1b[0m`);
  for (let r = 1; r <= rounds; r++) {
    console.log(`\n\x1b[33m■ Раунд ${r}\x1b[0m`);
    for (const self of AGENTS) {
      const d = await decide(client, m, self);
      if (!d) { console.log(`  ${self.id}: (пропуск)`); continue; }
      const act = m.give(self.id, d.to, d.type, d.message);
      console.log(`  \x1b[36m${self.id}\x1b[0m → \x1b[32m${d.to}\x1b[0m : ${d.type} (вес ${act.weight}) — ${d.message}`);
    }
  }

  const mx = m.metrics();
  console.log('\n\x1b[33m═══ возникшее общество ═══\x1b[0m');
  console.log('\nЭнергия (дал − принял):');
  mx.persons.forEach(p => console.log(`  ${p.id}: ${p.energy >= 0 ? '+' : ''}${p.energy.toFixed(1)}  (проводимость ${(p.conductivity * 100).toFixed(0)}%)`));
  console.log('\nАсимметрия нитей:');
  mx.asymmetry.forEach(a => console.log(`  ${a.a} ↔ ${a.b}: Δ${a.delta.toFixed(1)} в пользу ${a.favors}`));
  console.log('\nКредит (доля созданного потока, Shapley-подобно):');
  credit(m).forEach(c => console.log(`  ${c.id}: ${(c.share * 100).toFixed(0)}%`));
  console.log('\nПустыни (никто не дал):', mx.deserts.map(d => d.from + '→' + d.to).join(', ') || 'нет');
  console.log(`\n\x1b[2mактов в матрице (необратимы): ${m.log.length} · общий поток: ${mx.totalFlow.toFixed(1)}\x1b[0m`);
}

main();
