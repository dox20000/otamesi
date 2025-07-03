const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // ← Render対応でPORT取得方法を修正

app.use(cors());
app.use(express.json());

// 静的ファイルの配信
app.use(express.static(__dirname));

// ここを追加！ トップページでHTMLを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'click-game-ranking.html'));
});

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

// ランキングをリセットするAPI
app.post('/api/reset', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  res.json({ ok: true, message: "ランキングをリセットしました" });
});