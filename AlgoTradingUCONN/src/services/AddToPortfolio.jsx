import { updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const addToPortfolio = async (userId, stockTicker, stockData) => {
  const userRef = doc(db, "user_test", userId);

  try {
    await updateDoc(userRef, {
      [`Portfolio.${stockTicker}`]: stockData,
    });
    console.log(`${stockTicker} stock added to portfolio successfully!`);
  } catch (error) {
    console.error("Error adding stock to portfolio:", error);
    throw error;  // make sure to use this with a try {} catch() {}
  }
};