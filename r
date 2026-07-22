const express = require('express');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());

// Firebase Initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://talha-trader-admin-panel-lock-default-rtdb.firebaseio.com"
});

const db = admin.firestore(); // Ya Realtime Database

// '/r' Route Handler
app.get('/r', async (req, res) => {
  try {
    // 1. Query parameters ya data read karna
    const redirectId = req.query.id;

    // 2. Firebase se data fetch karna
    const docRef = db.collection('redirects').doc(redirectId || 'default');
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send('Data nahi mila');
    }

    const data = doc.data();

    // 3. Response bhejna ya redirect karna
    if (data.targetUrl) {
      return res.redirect(data.targetUrl);
    }

    return res.json({ success: true, data: data });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Server Error");
  }
});

module.exports = app;
