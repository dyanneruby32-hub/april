const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;

app.use(express.json());

// 托管静态文件（index.html、qrcode.png 等）
app.use(express.static(path.join(__dirname)));

// /api/chat 路由：转发请求到硅基流动
app.post('/api/chat', async (req, res) => {
  if (!SILICONFLOW_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 所有其他路由返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
