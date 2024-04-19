import { updateDoc, doc, getDoc } from "firebase/firestore";
import { getStockData } from "../components/Stats";
import { db } from "./firebase";

export const addToPortfolio = async (userId, stockTicker, stockData, main_portfolio, setPortfolio) => {
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

        const stockIndex = main_portfolio.findIndex((stock) => stock.ticker === stockTicker);
        if(stockIndex !== -1){
          const updatedPortfolio = [...main_portfolio];
          updatedPortfolio[stockIndex].numShares = amountShares;
          setPortfolio(updatedPortfolio);
        } else {
          throw new Error("stock was not found in main_portfolio");
        }

      } else { //user doesn't have any of this stock

        await updateDoc(userRef, {
          [`Portfolio.${stockTicker}`]: stockData,
        });

        const res = await getStockData(stockTicker);
        const newStock = {
          ticker: stockTicker,
          avgSharePrice: stockData.BuyPrice,
          numShares: stockData.Shares,
          info: res.data,
        };

        const updatedPortfolio = [...main_portfolio, newStock];
        setPortfolio(updatedPortfolio);
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