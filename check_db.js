const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, getCountFromServer } = require("firebase/firestore");
const dotenv = require("dotenv");
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
    const coll = collection(db, "products");
    const snapshot = await getCountFromServer(coll);
    console.log("Found products count:", snapshot.data().count);
    
    if (snapshot.data().count > 0) {
      const querySnapshot = await getDocs(coll);
      querySnapshot.forEach((doc) => {
        console.log(`- ${doc.id}: ${doc.data().name} (${doc.data().isBestseller ? 'BESTSELLER' : 'REGULAR'})`);
      });
    }
  } catch (e) {
    console.error("Error reading products:", e);
  }
  process.exit();
}

checkProducts();
