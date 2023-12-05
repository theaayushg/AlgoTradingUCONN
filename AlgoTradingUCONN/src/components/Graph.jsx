import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getApp } from 'firebase/app';
import { drawGraph } from '../services/DataVisualization/dist/graph'; // Assuming this is your drawing logic
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Graph = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Define your margins here
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  //comment out if you have it: 
  const app = getApp();
  const db = getFirestore(app);

  async function fetchData() {
      const querySnapshot = await getDocs(collection(db,"stocks"));
      const data= [];
      querySnapshot.forEach((doc) => {
          data.push(doc.data());
          console.log(doc.id, " => ", doc.data());
      });
      return data;
  }

  const companies = ["GOOGL", "APPL", "F"]; //should get this from firestore by running for loop to get all companies.
  const select = d3.select("#companySelect");

  select.selectAll("option")
      .data(companies)
      .enter()
      .append("option")
      .text(d =>d);

  select.on("change",function() {
      const company = d3.select(this).property("value");
      fetchData(company).then(data => {
          renderChart(data);
      })});

  function renderChart(data) {
      //clear chart
      d3.select("#chart").html("");
          
      // Set up svg
      const svg = d3.select("#chart").append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        // Call the drawGraph function with all necessary parameters
        drawGraph(svg, data, width, height, margin);
  }

  // Fetch initial data and render chart
  fetchData().then(data => {
    renderChart(data);
  });
  }, []); // Run this effect only once when the component mounts

  return <canvas ref={canvasRef} width="400" height="200" />;
};

export default Graph;