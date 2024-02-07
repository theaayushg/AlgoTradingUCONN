import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const increaseBalance = async (user, currentBalance, amountToAdd, setCurrentBalance) => {
  const userRef = doc(db, 'user_test', user.uid);

  try {
    await updateDoc(userRef, {
      balance: Number(currentBalance) + Number(amountToAdd),
    });

    setCurrentBalance(Number(currentBalance) + Number(amountToAdd));
  } catch (error) {
    console.error("Error updating balance:", error);
    throw error;
  }
};
