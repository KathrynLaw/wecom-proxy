export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const targetUrl = 'https://qyapi.weixin.qq.com' + req.url;

  try {
    const fetchOptions = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (req.body && req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const resp = await fetch(targetUrl, fetchOptions);
    const data = await resp.json();

    res.status(resp.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
