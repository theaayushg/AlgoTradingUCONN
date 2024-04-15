import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addToPortfolio = async (userId, stockTicker, stockData) => {
  const userRef = doc(db, "user_test", userId);

  try{
    const userDoc = await getDoc(userRef);

    if(userDoc.exists() && userDoc.data().Portfolio) {
      const portfolio = userDoc.data().Portfolio;

      if (portfolio[stockTicker]) { //check if user has stock
        const currentStock = portfolio[stockTicker];
        const amountShares = currentStock.Shares + Number(stockData.Shares);

        //need to adjust average buy price in future
        await updateDoc(userRef, {
          [`Portfolio.${stockTicker}.Shares`]: amountShares,
        });

      } else { //user doesn't have any of this stock

        await updateDoc(userRef, {
          [`Portfolio.${stockTicker}`]: stockData,
        });

      }

      console.log(`${stockData.Shares} shares of ${stockTicker} bought successfully!`);
    } else{
      console.error("User document not found or user has no portfolio!");
      throw new Error("User document not found or user has no portfolio!");
    }
  } catch (error) {
    console.error("Error buying stock:", error);
    throw error;
  }
};