const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// HTMLや静的ファイルも同じディレクトリから配信
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'scores.json');

// スコアを保存
app.post('/api/score', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') return res.status(400).send('Invalid');
  let scores = [];
  if (fs.existsSync(DATA_FILE)) {
    scores = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10); // 上位10件だけ
  fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2));
  res.json({ ok: true });
});

// ランキング取得
app.get('/api/ranking', (req, res) => {
  let scores = [];
  if (fs.existsSync(DATA_FILE)) {
    scores = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  res.json(scores);
});

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));