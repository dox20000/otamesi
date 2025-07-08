const express = require('express');
const cors = require('cors');
const path = require('path');
const { addScore, getScores, resetScores } = require('./server/scoreStore');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'click-game-ranking.html'));
});

// スコアを保存（Firebase使用）
app.post('/api/score', async (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') return res.status(400).send('Invalid');
  try {
    const scores = await addScore({ name, score });
    res.json({ ok: true, scores });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'サーバーエラー', error: err.message });
  }
});

// ランキング取得（Firebase使用）
app.get('/api/ranking', async (req, res) => {
  try {
    const scores = await getScores();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ ok: false, message: 'サーバーエラー', error: err.message });
  }
});

// ランキングをリセット（Firebase使用）
app.post('/api/reset', async (req, res) => {
  try {
    await resetScores();
    res.json({ ok: true, message: "ランキングをリセットしました" });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'サーバーエラー', error: err.message });
  }
});

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));