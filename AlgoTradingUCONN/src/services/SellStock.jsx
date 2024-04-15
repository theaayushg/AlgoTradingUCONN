import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const sellStock = async (userId, stockTicker, numShares) => {
  const userRef = doc(db, "user_test", userId);
  
  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().Portfolio) {
      const portfolio = userDoc.data().Portfolio;

      if (portfolio[stockTicker]) { // check if user has stock
        const currentStock = portfolio[stockTicker];

        const remainingShares = currentStock.Shares - numShares;

        if (remainingShares >= 0) {
          await updateDoc(userRef, {
            [`Portfolio.${stockTicker}.Shares`]: remainingShares,
          });
          console.log(`${numShares} shares of ${stockTicker} sold successfully!`);
        } else {
          console.error("Insufficient shares to sell!");
          throw new Error("Insufficient shares to sell!");
        }
      } else {
        console.error(`Stock ${stockTicker} not found in user's portfolio!`);
        throw new Error(`Stock ${stockTicker} not found in user's portfolio!`);
      }
    } else {
      console.error("User document not found or user has no portfolio!");
      throw new Error("User document not found or user has no portfolio!");
    }
  } catch (error) {
    console.error("Error selling stock:", error);
    throw error;
  }
};
