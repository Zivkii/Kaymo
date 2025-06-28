'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface CountryData {
  country: string;
  deforestationRate: number;
  forestCover: number; // percentage of land area
  populationDensity: number; // people per km²
  gdpPerCapita: number; // USD
  color: string;
}

const regionalData: CountryData[] = [
  {
    country: 'Somalia',
    deforestationRate: 1.03,
    forestCover: 10.8,
    populationDensity: 25,
    gdpPerCapita: 447,
    color: '#DC2626'
  },
  {
    country: 'Ethiopia',
    deforestationRate: 0.93,
    forestCover: 12.2,
    populationDensity: 115,
    gdpPerCapita: 936,
    color: '#7C3AED'
  },
  {
    country: 'Kenya',
    deforestationRate: 0.67,
    forestCover: 7.4,
    populationDensity: 95,
    gdpPerCapita: 2081,
    color: '#059669'
  },
  {
    country: 'Djibouti',
    deforestationRate: 0.45,
    forestCover: 0.2,
    populationDensity: 43,
    gdpPerCapita: 3396,
    color: '#2563EB'
  },
  {
    country: 'Eritrea',
    deforestationRate: 0.83,
    forestCover: 15.7,
    populationDensity: 65,
    gdpPerCapita: 625,
    color: '#EA580C'
  },
  {
    country: 'Sudan',
    deforestationRate: 0.78,
    forestCover: 17.8,
    populationDensity: 25,
    gdpPerCapita: 441,
    color: '#DB2777'
  }
];

type ChartType = 'deforestation' | 'forestCover' | 'correlation';

export default function RegionalComparison() {
  const [activeChart, setActiveChart] = useState<ChartType>('deforestation');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.bottom - margin.top;

    const container = svg
      .attr('width', 600)
      .attr('height', 400)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    if (activeChart === 'deforestation') {
      // Bar chart for deforestation rates
      const xScale = d3.scaleBand()
        .domain(regionalData.map(d => d.country))
        .range([0, width])
        .padding(0.2);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(regionalData, d => d.deforestationRate) as number])
        .range([height, 0]);

      // Add axes
      container.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

      container.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`));

      // Add bars
      container.selectAll('.bar')
        .data(regionalData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.country)!)
        .attr('width', xScale.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .attr('y', d => yScale(d.deforestationRate))
        .attr('height', d => height - yScale(d.deforestationRate));

      // Add labels
      container.selectAll('.label')
        .data(regionalData)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.country)! + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.deforestationRate) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#374151')
        .text(d => `${d.deforestationRate}%`);

    } else if (activeChart === 'forestCover') {
      // Horizontal bar chart for forest cover
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(regionalData, d => d.forestCover) as number])
        .range([0, width]);

      const yScale = d3.scaleBand()
        .domain(regionalData.map(d => d.country))
        .range([0, height])
        .padding(0.2);

      // Add axes
      container.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `${d}%`));

      container.append('g')
        .call(d3.axisLeft(yScale));

      // Add bars
      container.selectAll('.bar')
        .data(regionalData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.country)!)
        .attr('height', yScale.bandwidth())
        .attr('x', 0)
        .attr('width', 0)
        .attr('fill', d => d.color)
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .attr('width', d => xScale(d.forestCover));

      // Add labels
      container.selectAll('.label')
        .data(regionalData)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.forestCover) + 5)
        .attr('y', d => yScale(d.country)! + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#374151')
        .text(d => `${d.forestCover}%`);

    } else if (activeChart === 'correlation') {
      // Scatter plot: GDP vs Deforestation Rate
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(regionalData, d => d.gdpPerCapita) as number])
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(regionalData, d => d.deforestationRate) as number])
        .range([height, 0]);

      // Add axes
      container.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `$${d}`));

      container.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`));

      // Add axis labels
      container.append('text')
        .attr('transform', `translate(${width / 2}, ${height + 50})`)
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#6B7280')
        .text('GDP per Capita (USD)');

      container.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -(height / 2))
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#6B7280')
        .text('Deforestation Rate (%)');

      // Add circles
      container.selectAll('.dot')
        .data(regionalData)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('r', 0)
        .attr('cx', d => xScale(d.gdpPerCapita))
        .attr('cy', d => yScale(d.deforestationRate))
        .attr('fill', d => d.color)
        .attr('opacity', 0.8)
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 2)
        .transition()
        .duration(1000)
        .attr('r', 8);

      // Add country labels
      container.selectAll('.country-label')
        .data(regionalData)
        .enter().append('text')
        .attr('class', 'country-label')
        .attr('x', d => xScale(d.gdpPerCapita) + 12)
        .attr('y', d => yScale(d.deforestationRate))
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#374151')
        .text(d => d.country);
    }

  }, [activeChart]);

  const chartOptions = [
    { 
      id: 'deforestation' as ChartType, 
      label: 'Deforestation Rates', 
      description: 'Annual forest loss percentage by country' 
    },
    { 
      id: 'forestCover' as ChartType, 
      label: 'Forest Coverage', 
      description: 'Percentage of land area covered by forests' 
    },
    { 
      id: 'correlation' as ChartType, 
      label: 'GDP vs Deforestation', 
      description: 'Relationship between economic development and forest loss' 
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          East Africa Regional Comparison
        </h3>
        <p className="text-gray-600">
          Compare Somalia's deforestation with neighboring countries
        </p>
      </div>

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveChart(option.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeChart === option.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart Description */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <p className="text-sm text-gray-600">
          {chartOptions.find(opt => opt.id === activeChart)?.description}
        </p>
      </motion.div>

      {/* Chart */}
      <div className="flex justify-center mb-6">
        <svg ref={svgRef} className="w-full max-w-2xl h-auto"></svg>
      </div>

      {/* Key Insights */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-50 rounded-lg p-4"
      >
        <h4 className="font-semibold text-gray-800 mb-2">Key Insights</h4>
        {activeChart === 'deforestation' && (
          <p className="text-sm text-gray-600">
            Somalia has the highest deforestation rate in the region at 1.03%, 
            significantly above the regional average of 0.72%.
          </p>
        )}
        {activeChart === 'forestCover' && (
          <p className="text-sm text-gray-600">
            Despite high deforestation, Somalia maintains 10.8% forest cover, 
            though this is declining rapidly compared to Sudan's 17.8%.
          </p>
        )}
        {activeChart === 'correlation' && (
          <p className="text-sm text-gray-600">
            Lower GDP countries like Somalia and Sudan show higher deforestation rates, 
            suggesting economic pressures drive forest exploitation for immediate income.
          </p>
        )}
      </motion.div>
    </div>
  );
}