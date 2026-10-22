const { randomUUID } = require('node:crypto');
const key = 'gilbert-portfolio:hearts:v1';
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({error:'Method not allowed'});
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(503).json({error:'Counter is not connected yet.'});
  if (req.method === 'POST') {
    const origin = req.headers.origin;
    if (origin && origin !== `https://${req.headers.host}`) return res.status(403).json({error:'Invalid origin'});
    if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).json({error:'JSON required'});
    if (typeof req.body?.active !== 'boolean') return res.status(400).json({error:'A boolean active value is required'});
  }
  const cookies = req.headers.cookie || '';
  let id = cookies.match(/(?:^|;\s*)portfolio_visitor=([a-f0-9-]{36})(?:;|$)/)?.[1];
  if (!id) {
    id = randomUUID();
    res.setHeader('Set-Cookie', `portfolio_visitor=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`);
  }
  // Set membership makes retries idempotent; Lua returns a consistent count and state.
  const script = `if ARGV[2] == 'add' then redis.call('SADD', KEYS[1], ARGV[1]) elseif ARGV[2] == 'remove' then redis.call('SREM', KEYS[1], ARGV[1]) end return {redis.call('SCARD', KEYS[1]), redis.call('SISMEMBER', KEYS[1], ARGV[1])}`;
  const action = req.method === 'POST' ? (req.body.active ? 'add' : 'remove') : 'read';
  try {
    const upstream = await fetch(url, {
      method:'POST', headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'},
      body:JSON.stringify(['EVAL', script, '1', key, id, action]), signal:AbortSignal.timeout(8000)
    });
    if (!upstream.ok) throw new Error('Database request failed');
    const data = await upstream.json();
    if (data.error || !Array.isArray(data.result) || !Number.isSafeInteger(data.result[0]) || data.result[0] < 0) throw new Error('Invalid database response');
    return res.status(200).json({count:data.result[0], active:data.result[1] === 1});
  } catch {
    return res.status(503).json({error:'Counter temporarily unavailable. Please try again.'});
  }
};
