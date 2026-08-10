const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

app.all('*', async (req, res) => {
  const targetPath = req.path;
  const qs = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
  const targetUrl = 'https://qyapi.weixin.qq.com' + targetPath + qs;

  try {
    const options = {
      method: req.method,
      hostname: 'qyapi.weixin.qq.com',
      path: targetPath + qs,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      }
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let data = '';
      proxyRes.setEncoding('utf8');
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        res.status(proxyRes.statusCode).send(data);
      });
    });

    proxyReq.on('error', (err) => {
      res.status(500).json({ error: err.message });
    });

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      proxyReq.write(JSON.stringify(req.body));
    }
    proxyReq.end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WeCom proxy running on port ${PORT}`);
});
