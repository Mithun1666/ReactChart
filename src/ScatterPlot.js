import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './App.css'; // Make sure to include the styles for the font family

const ScatterPlot = () => {
  const [activeChart, setActiveChart] = useState('INR');
  const svgRef = useRef();

  const width = 600;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 60, left: 100 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Hardcoded data
  const rawData = [
    { company: 'Unacademy', role: 'Software Engineer', city: 'Hyderabad', salaryUSD: 16867, experience: 2.0, salaryINR: 1401647.7 },
    { company: 'BYJUS', role: 'Software Developer', city: 'Bengaluru', salaryUSD: 13253, experience: 3.3, salaryINR: 1101324.3 },
    { company: 'Unacademy', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 21687, experience: 2.5, salaryINR: 1802189.7 },
    { company: 'Nykaa', role: 'Senior Software Engineer', city: 'Gurugram', salaryUSD: 35361, experience: 4.9, salaryINR: 2938499.1 },
    { company: 'MakeMyTrip', role: 'Senior Software Engineer', city: 'Gurugram', salaryUSD: 20482, experience: 3.5, salaryINR: 1702054.2 },
    { company: 'Razorpay', role: 'Frontend Engineer', city: 'Mumbai', salaryUSD: 20482, experience: 2.0, salaryINR: 1702054.2 },
    { company: 'Bigbasket', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 32530, experience: 4.0, salaryINR: 2703243 },
    { company: 'Paytm', role: 'Senior Software Engineer', city: 'Noida', salaryUSD: 21687, experience: 4.6, salaryINR: 1802189.7 },
    { company: 'Myntra', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 43373, experience: 5.3, salaryINR: 3604296.3 },
    { company: 'BigBasket', role: 'Senior Software Engineer', city: 'Bengaluru', salaryUSD: 29518, experience: 4.6, salaryINR: 2452945.8 },
    { company: 'Swiggy', role: 'Software Engineer', city: 'Bengaluru', salaryUSD: 30120, experience: 2.0, salaryINR: 2502972 }
  ];

  useEffect(() => {
    if (rawData.length === 0) return;

    // Set up SVG and scales
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear existing content

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([1.5, 5.5])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(activeChart === 'INR' ? [0, 4000000] : [0, 50000])
      .range([innerHeight, 0]);

    // X-axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues([1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5]));

    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('font-family', 'Onest')
      .text('Years of Experience');

    // Y-axis
    const yAxis = g.append('g')
      .call(activeChart === 'INR' 
        ? d3.axisLeft(yScale).tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000])
        : d3.axisLeft(yScale).tickValues([0, 10000, 20000, 30000, 40000, 50000]));

    yAxis.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 20)
      .attr('x', -innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .text(`Current Salary (${activeChart})`);

    // Grid lines
    const make_x_gridlines = () => d3.axisBottom(xScale).ticks(10);
    const make_y_gridlines = () => d3.axisLeft(yScale).ticks(10);

    // Add X gridlines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(make_x_gridlines()
        .tickSize(-innerHeight)
        .tickFormat("")
      );

    // Add Y gridlines
    g.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
        .tickSize(-innerWidth)
        .tickFormat("")
      );

    // Tooltip
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("font-family", "Onest");

    // Add circles and company names
    const circles = g.selectAll('circle')
      .data(rawData)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.experience))
      .attr('cy', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD))
      .attr('r', 5)
      .attr('fill', '#005dff')
      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Company: ${d.company}<br/>
                      Role: ${d.role}<br/>
                      City: ${d.city}<br/>
                      Experience: ${d.experience} years<br/>
                      Salary (${activeChart}): ${activeChart === 'INR' ? d.salaryINR.toLocaleString() : d.salaryUSD.toLocaleString()}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Add company names
    g.selectAll('text.company')
      .data(rawData)
      .enter()
      .append('text')
      .attr('class', 'company')
      .attr('x', d => xScale(d.experience))
      .attr('y', d => yScale(activeChart === 'INR' ? d.salaryINR : d.salaryUSD) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'Onest')
      .attr('font-size', '10px')
      .attr('fill', '#005dff')
      .text(d => d.company);

  }, [activeChart, rawData]);

  // Styles for the buttons
  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    border: '2px solid #000',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    fontFamily: 'Onest'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'blue',
    color: 'white',
  };

  const inactiveButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className="App" style={{ fontFamily: 'Onest' }}>
      <h1>Salary vs Experience Chart</h1>
      <div>
        <button 
          style={activeChart === 'INR' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('INR')}
        >
          INR
        </button>
        <button 
          style={activeChart === 'USD' ? activeButtonStyle : inactiveButtonStyle}
          onClick={() => setActiveChart('USD')}
        >
          USD
        </button>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default ScatterPlot;
