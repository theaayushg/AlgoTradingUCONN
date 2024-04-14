// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from "firebase/auth"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
      await setDoc(userRef, {
        Name: user.displayName,
        email: user.email,
        balance: 0.00,
        address: None,
        phone_number: None,
        Portfolio: {},
        Orders: {},
      });
    }
  } catch (error) {
    console.error("Error checking/updating user in Firestore:", error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    createOrUpdateUser(user);
  }
});

export default auth;