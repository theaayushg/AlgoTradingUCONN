import * as d3 from 'd3';
// Helper function to draw axes
function drawAxes(context, xScale, yScale, width, height, margin) {
    // Create a new path for the x-axis and y-axis and style them
    context.beginPath();
    context.strokeStyle = 'white';
    // Draw x-axis
    context.moveTo(margin.left, height - margin.bottom);
    context.lineTo(width - margin.right, height - margin.bottom);
    // Draw y-axis
    context.moveTo(margin.left, margin.top);
    context.lineTo(margin.left, height - margin.bottom);
    context.stroke();
    // Draw x-axis label
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('X Axis Label', width / 2, height - margin.bottom + 20);
    // Draw y-axis label
    context.save();
    context.translate(margin.left - 40, height / 2);
    context.rotate(-Math.PI / 2);
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillText('Y Axis Label', 0, 0);
    context.restore();
}
// Function to draw the graph
export const drawGraph = (context, data, width, height, margin) => {
    // Clear the canvas
    context.clearRect(0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom);
    // Define scales for the graph
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.x)).nice()
        .range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, (d) => d.y)).nice()
        .range([height - margin.bottom, margin.top]);
    // Draw axes
    drawAxes(context, xScale, yScale, width, height, margin);
    // Draw data points
    data.forEach(d => {
        context.fillStyle = 'steelblue';
        context.beginPath();
        context.arc(xScale(d.x), yScale(d.y), 4, 0, 2 * Math.PI);
        context.fill();
    });
};
//# sourceMappingURL=graph.js.map