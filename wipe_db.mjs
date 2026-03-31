import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEqwMQKQEbDgl10tG4I_lGRPZmFNrbces",
  authDomain: "kaleemiya-484ab.firebaseapp.com",
  projectId: "kaleemiya-484ab",
  storageBucket: "kaleemiya-484ab.firebasestorage.app",
  messagingSenderId: "695209573005",
  appId: "1:695209573005:web:91bc0a3463cdabb96f80c4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function wipeDatabase() {
  console.log("Wiping Firestore products collection...");
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    console.log(`Found ${querySnapshot.size} products to Delete.`);
    
    const deletePromises = querySnapshot.docs.map((d) => {
      console.log(`Deleting: ${d.data().name} (${d.id})`);
      return deleteDoc(doc(db, "products", d.id));
    });
    
    await Promise.all(deletePromises);
    console.log("WIPE COMPLETE! All dummy products removed from Cloud.");
  } catch (e) {
    console.error("Wipe failed:", e);
  }
  process.exit();
}

wipeDatabase();
