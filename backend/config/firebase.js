const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  ),
  storageBucket: "diagnosis-reports.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;

