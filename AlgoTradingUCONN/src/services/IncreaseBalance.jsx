import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const increaseBalance = async (user, currentBalance, amountToAdd, setCurrentBalance) => {
  const userRef = doc(db, 'user_test', user.uid);

  try 
  {
    const newBalance = Number(currentBalance) + Number(amountToAdd);

    if (newBalance < 0) 
    {
      throw new Error("Insufficient funds. Please try again.");
    }

    await updateDoc(userRef, {balance: newBalance,});

    setCurrentBalance(newBalance);
  } 
  catch (error) 
  {
    console.error("Error updating balance:", error);
    throw error;
  }
};