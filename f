const express = require('express');
const crypto = require('crypto');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. Firebase Admin SDK Initialization
// Firebase Console se download ki gayi Service Account JSON file ka data yahan aayega
const serviceAccount = {
  "type": "service_account",
  "project_id": "magic-scripts-control", // Aapka Firebase Project ID
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  "client_email": "firebase-adminsdk-xxxxx@magic-scripts-control.iam.gserviceaccount.com", // Firebase service account email
  "client_id": "xxxxxxxxxxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.google.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40magic-scripts-control.iam.gserviceaccount.com"
};

// Control panel admin email configuration
const CONTROL_EMAIL = "nasiriq703@gmail.com";

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://magic-scripts-control-default-rtdb.firebaseio.com" // Aapki Realtime DB URL
  });
  console.log("Firebase system successfully connected for:", CONTROL_EMAIL);
} catch (error) {
  console.error("Firebase Initialization Error:", error.message);
}

const db = admin.firestore(); // Ya fir admin.database() agar Realtime Database use karni ho

// 2. Route: Unique Crypto ID Generate karna aur Redirect karna
app.get('/generate-link', (req, res) => {
  // 20-character ki secure random hex string generate karega as Crypto ID
  const cryptoId = crypto.randomBytes(10).toString('hex');
  
  // Aapka target Vercel URL dynamic parameter ke sath
  const targetUrl = `https://magic-scripts-android-feed.vercel.app/f?id=${cryptoId}`;
  
  // Initial state Firebase mein save karne ke liye (Track karne ke liye)
  db.collection('active_sessions').doc(cryptoId).set({
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    status: 'generated',
    controlled_by: CONTROL_EMAIL,
    allowed_access: true
  }).then(() => {
    res.json({
      success: true,
      crypto_id: cryptoId,
      generated_link: targetUrl
    });
  }).catch(err => {
    res.status(500).json({ success: false, error: err.message });
  });
});

// 3. Route: Link Verification aur Authorization Engine
app.get('/verify-access', async (req, res) => {
  const { id } = req.query; // URL se ?id=${crypto} nikalne ke liye
  
  if (!id) {
    return res.status(400).json({ success: false, message: "Missing tracking ID parameter." });
  }

  try {
    const sessionRef = db.collection('active_sessions').doc(id);
    const doc = await sessionRef.get();

    if (!doc.exists) {
      return res.status(403).json({ success: false, message: "Invalid or expired session ID." });
    }

    const sessionData = doc.data();

    // Check karega ke administrator (nasiriq703@gmail.com) ne access block to nahi kiya
    if (!sessionData.allowed_access) {
      return res.status(403).json({ success: false, message: "Access suspended by control administrator." });
    }

    // Session log ko update karega active state mein
    await sessionRef.update({
      last_accessed: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    });

    res.json({
      success: true,
      message: "Access granted.",
      admin_control: CONTROL_EMAIL,
      payload: sessionData
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server Configuration
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
