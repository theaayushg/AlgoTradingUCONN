import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { drawGraph } from '../services/DataVisualization/dist/graph'; // Assuming this is your drawing logic

const Graph = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = d3.select(canvasRef.current);
    const context = canvas.node().getContext('2d');

    if (context) {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 750 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
      const data = Array.from({ length: 100 }, () => ({
        x: getRandomNumber(margin.left, width - margin.right),
        y: getRandomNumber(margin.top, height - margin.bottom)
      }));

      drawGraph(context, data, width, height, margin);
    }
  }, []); // Run this effect only once when the component mounts

  return <canvas ref={canvasRef} width="800" height="600" />;
};

export default Graph;
