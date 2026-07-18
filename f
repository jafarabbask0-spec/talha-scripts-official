// Firebase SDK modules import karein
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";

// Aapki Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRH5wa72kDawOqbOCzOJyH91OS0Qu1Hwc",
  authDomain: "talha-trader-admin-panel-lock.firebaseapp.com",
  databaseURL: "https://talha-trader-admin-panel-lock-default-rtdb.firebaseio.com",
  projectId: "talha-trader-admin-panel-lock",
  storageBucket: "talha-trader-admin-panel-lock.firebasestorage.app",
  messagingSenderId: "984637629215",
  appId: "1:984637629215:web:4b1924b5a809ea98cb862a",
  measurementId: "G-GQL9MMH365"
};

// Firebase ko initialize karein
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function: Link ko Firebase database mein bhejne ke liye
function saveLinkToFirebase(cryptoId) {
  // Pura link taiyar karein
  const fullLink = `https://talha-scripts-official.vercel.app/f?id=${cryptoId}`;
  
  // Database mein 'wrestling_links' naam ka ek folder/node banega
  const linksRef = ref(database, 'wrestling_links');
  const newLinkRef = push(linksRef); // Har baar ek unique ID ke sath save hoga

  // Data ko Firebase mein set (bhejna) karna
  set(newLinkRef, {
    link: fullLink,
    cryptoId: cryptoId,
    timestamp: new Date().toISOString() // Kab save hua, uski timing
  })
  .then(() => {
    console.log("Data Firebase mein successfully save ho gaya hai! ✅");
  })
  .catch((error) => {
    console.error("Firebase mein data bhejne mein error aaya: ❌", error);
  });
}

// Example usage: 
// Agar aapka id 'bitcoin' ya koi aur value hai, toh bas function ko call karein:
// saveLinkToFirebase("bitcoin");
