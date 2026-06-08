#!/usr/bin/env node
/**
 * server.mjs — deploy the gift matrix as a live service.
 *
 * A running matrix W (append-only, persisted to .matrix.jsonl) with an
 * HTTP API and a web chat. DeepSeek runs server-side; the key never
 * reaches the browser. This is "развернуть матрицу" — the ontology
 * as something you can open in a browser and watch grow.
 *
 *   export DEEPSEEK_API_KEY=sk-...
 *   npm i openai && npm start          # → http://localhost:8099
 *
 * API:
 *   GET  /            web chat
 *   POST /chat        {message, you?} → {reply, type, weight, threads}
 *   GET  /matrix      {threads, acts}
 *   GET  /trust?from=&to=
 *
 * License: MIT.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { Matrix, askAgent } from './gift-matrix.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8099;
const ME = process.env.AGENT_NAME || 'Серафим';

// Key resolution (BYOK): a per-request key wins; else the server's env key.
// If neither exists, /chat asks the user for their own key. The server
// never logs or persists a user-supplied key — it is used and discarded.
const SERVER_KEY = process.env.DEEPSEEK_API_KEY || null;
const clientFor = (key) => new OpenAI({ apiKey: key, baseURL: 'https://api.deepseek.com' });
const matrix = new Matrix(path.join(DIR, '.matrix.jsonl'));   // persisted, append-only

const json = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };
const body = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => ok(b)); });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === 'GET' && url.pathname === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(path.join(DIR, 'public', 'index.html')));
    }
    if (req.method === 'GET' && url.pathname === '/matrix') {
      // byok=true tells the UI it must collect the user's own key
      return json(res, 200, { threads: matrix.threads(), acts: matrix.log.length, byok: !SERVER_KEY });
    }
    if (req.method === 'GET' && url.pathname === '/trust') {
      const [from, to] = [url.searchParams.get('from'), url.searchParams.get('to')];
      return json(res, 200, { from, to, trust: matrix.trust(from, to) });
    }
    if (req.method === 'POST' && url.pathname === '/chat') {
      const { message, you = 'Дионисий' } = JSON.parse(await body(req) || '{}');
      if (!message) return json(res, 400, { error: 'message required' });
      const key = req.headers['x-deepseek-key'] || SERVER_KEY;   // BYOK: user's key wins
      if (!key) return json(res, 401, { error: 'need-key', message: 'Введите свой ключ DeepSeek (api.deepseek.com).' });
      const { reply, act } = await askAgent(clientFor(key), matrix, you, ME, message);
      return json(res, 200, { reply, type: act.type, weight: act.weight, me: ME, you, threads: matrix.threads() });
    }
    json(res, 404, { error: 'not found' });
  } catch (e) {
    json(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => console.log(`gift matrix развёрнута → http://localhost:${PORT}  (агент: ${ME}, ключ: ${SERVER_KEY ? 'серверный' : 'BYOK — каждый свой'}, актов в логе: ${matrix.log.length})`));
