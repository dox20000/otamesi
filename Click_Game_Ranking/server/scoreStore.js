const db = require("./firebase");

const SCORE_PATH = "scores/global";

async function getScore() {
  const snapshot = await db.ref(SCORE_PATH).once("value");
  return snapshot.val() || 0;
}

async function setScore(score) {
  await db.ref(SCORE_PATH).set(score);
}

module.exports = { getScore, setScore };