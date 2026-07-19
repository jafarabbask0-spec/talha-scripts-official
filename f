// Firebase SDK modules import karein
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database"; // Realtime Database ke liye imports

// Aapki Firebase configuration
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
const analytics = getAnalytics(app);
const database = getDatabase(app); // Database instance banayein

// Function: Link ko Firebase database mein save karne ke liye
function saveWrestlingLink(cryptoValue) {
  // Aapka link dynamic crypto value ke sath
  const dynamicLink = `https://talha-scripts-official.vercel.app/f?id=${cryptoValue}`;

  // Database mein kis path par data save karna hai (e.g., 'wrestling_data/current_link')
  const dataRef = ref(database, 'wrestling_data');

  // Data ko Firebase mein bhejna
  set(dataRef, {
    link: dynamicLink,
    cryptoId: cryptoValue,
    timestamp: new Date().toISOString()
  })
  .then(() => {
    console.log("Data Firebase mein kamyabi se save ho gaya hai!");
  })
  .catch((error) => {
    console.error("Data save karne mein error aaya: ", error);
  });
}

// Istemaal karne ka tareeqa:
// Jab aapko data bhejna ho, function ko call karein aur crypto id pass karein:
// saveWrestlingLink("your_crypto_id_here");
