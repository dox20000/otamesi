const admin = require("firebase-admin");
const serviceAccount = require("./click-game-ranking-sys-firebase-adminsdk-fbsvc-bcc0dbf3b9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
});

const db = admin.database();
module.exports = db;