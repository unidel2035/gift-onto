#!/usr/bin/env node
/**
 * agent-chat.mjs — CLI: an AI agent (DeepSeek) that is a person in the gift matrix.
 *
 *   export DEEPSEEK_API_KEY=sk-...
 *   npm i openai
 *   node demo/agent-chat.mjs            # interactive  (/w · /trust · /exit)
 *   node demo/agent-chat.mjs --script   # scripted smoke test, no stdin
 *
 * License: MIT.
 */
import OpenAI from 'openai';
import readline from 'node:readline';
import { Matrix, askAgent } from './gift-matrix.mjs';

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
      render(m, you, me, await askAgent(client, m, you, me, msg));
    }
    console.log('\n\x1b[33mИтог матрицы W:\x1b[0m');
    m.threads().forEach(({ k, w }) => console.log(`  ${k}: ${w.toFixed(1)}`));
    console.log(`\x1b[2mактов в логе (необратимы): ${m.log.length}\x1b[0m`);
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: `\x1b[32m${you}:\x1b[0m ` });
  rl.prompt();
  rl.on('line', async (line) => {
    const t = line.trim();
    if (t === '/exit') return rl.close();
    if (t === '/w') { m.threads().forEach(({ k, w }) => console.log(`  ${k}: ${w.toFixed(1)}`)); return rl.prompt(); }
    if (t === '/trust') { console.log(`  ${you}→${me}: ${m.trust(you, me).toFixed(1)} | ${me}→${you}: ${m.trust(me, you).toFixed(1)}`); return rl.prompt(); }
    if (!t) return rl.prompt();
    try { render(m, you, me, await askAgent(client, m, you, me, t)); }
    catch (e) { console.error('\x1b[31mошибка DeepSeek:\x1b[0m', e.message); }
    rl.prompt();
  });
}

main();
