import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { storage } from '../services/firebase.jsx';
import { ref, getDownloadURL } from "firebase/storage";

function StockPrediction({ company }) {
  useEffect(() => {
    const fetchDataAndPredict = async () => {
    //   try {
        // Load machine learning model from Firebase Storage
        const modelRef = ref(storage, "gs://algotradinguconn.appspot.com/jason/model.json");
        const modelUrl = await getDownloadURL(modelRef);
        const model = await tf.loadLayersModel(modelUrl);

        console.log(modelRef);
        console.log("hello");
        console.log(model);

        // Perform predictions or any other relevant logic here
    //   } 
    //   catch (error) {
    //     console.error('Error fetching data or making predictions:', error);
    //   }
    };

    fetchDataAndPredict();

    // Ensure to return a cleanup function from the useEffect hook
    return () => {};
  }, [company]);

  // Ensure to return null or JSX from the component
  return null;
}

export default StockPrediction;