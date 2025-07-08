const express = require("express");
const { getScore, setScore } = require("./scoreStore");
const app = express();

app.use(express.json());

app.get("/score", async (req, res) => {
  const score = await getScore();
  res.json({ score });
});

app.post("/click", async (req, res) => {
  let score = await getScore();
  score += 1;
  await setScore(score);
  res.json({ score });
});

app.listen(3000, () => {
  console.log("Server running!");
});