import { doc, updateDoc, getDoc, deleteField } from "firebase/firestore";
import { db } from "./firebase";

//need to remove stock from database

export const sellStock = async (userId, stockTicker, numShares, main_portfolio, setPortfolio) => {
  const userRef = doc(db, "user_test", userId);

  try {
    const userDoc = await getDoc(userRef);

    if (userDoc.exists() && userDoc.data().Portfolio) {
      const portfolio = userDoc.data().Portfolio;

      if (portfolio[stockTicker]) { // check if user has stock
        const currentStock = portfolio[stockTicker];

        const remainingShares = currentStock.Shares - numShares;

        if (remainingShares > 0) {
          await updateDoc(userRef, {
            [`Portfolio.${stockTicker}.Shares`]: remainingShares,
          });

          const stockIndex = main_portfolio.findIndex((stock) => stock.ticker === stockTicker);
          const updatedPortfolio = [...main_portfolio];
          updatedPortfolio[stockIndex].numShares = remainingShares;
          setPortfolio(updatedPortfolio);

          console.log(`${numShares} shares of ${stockTicker} sold successfully!`);
        } else if (remainingShares === 0){
          //need to remove database entry
          await updateDoc(userRef, {
            [`Portfolio.${stockTicker}`]: deleteField()
          });

          const updatedPortfolio = main_portfolio.filter(stock => stock.ticker !== stockTicker);
          setPortfolio(updatedPortfolio);

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
