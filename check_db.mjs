import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkProducts() {
  console.log("Checking Firestore for project:", process.env.VITE_FIREBASE_PROJECT_ID);
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    console.log("Found products count:", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => `, doc.data().name);
    });
  } catch (e) {
    console.error("Error reading products:", e);
  }
  process.exit();
}

checkProducts();
