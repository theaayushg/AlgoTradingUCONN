// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage"
import stocksList from "../components/stocksList";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfpTo6NTh41B0jx-0gov5ox7prSGQgmNA",
  authDomain: "algotradinguconn.firebaseapp.com",
  projectId: "algotradinguconn",
  storageBucket: "algotradinguconn.appspot.com",
  messagingSenderId: "839777988721",
  appId: "1:839777988721:web:5d49a734b597a90a672bd0",
  measurementId: "G-SB1L5D30Q0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// added for user authentication
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const modelRef= ref(storage,"models/AMZN's model.tflite");
//const modelUrl = await modelRef.getDownloadURL();

console.log(modelRef);


const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => {
  try {
    return signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

const createOrUpdateUser = async (user) => {
  const userRef = doc(db, "user_test", user.uid);

  try {
    const docSnapshot = await getDoc(userRef);

    if (!docSnapshot.exists()){
      console.log("creating new user document in firestore");
      await setDoc(userRef, {
        Name: user.displayName,
        email: user.email,
        balance: 0.00,
        address: "",
        phone_number: "",
        Date_of_Birth: "",
        Portfolio: {},
        Orders: {},
      });
    }
  } catch (error) {
    console.error("Error checking/updating user in Firestore:", error);
  }
};

const checkStockData = async () => {
  const sDocRef = doc(db, "StockData", "Data");

  try{
    const docSnapshot = await getDoc(sDocRef);
    const StocksD = docSnapshot.data().Stocks;
    for (const stock of stocksList){
      if (StocksD && StocksD[stock]) {
        console.log(`${stock} already exists in the database`);
      } else {
        console.log(`${stock} does not exist in the database`);

        // Create a new map object for the stock
        const newStockMap = {
          name: stock,
          c: 0.00,
          d: 0.00,
          dp: 0.00,
          h: 0.00,
          l: 0.00,
          o: 0.00,
          pc: 0.00,
          t: 0
        };

        // Set the new map object in the 'Stocks' collection
        await updateDoc(sDocRef, {
          [`Stocks.${stock}`]: newStockMap,
        });

        console.log(`Created map for ${stock}`);
      }
    };
  } catch (error){
    console.log("failed", error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    createOrUpdateUser(user);
  }
});

export default auth;