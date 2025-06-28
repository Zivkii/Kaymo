'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface DataPoint {
  year: number;
  forestCover: number; // in thousands of hectares
  deforestationRate: number; // percentage
  events: string[];
}

const timelineData: DataPoint[] = [
  { year: 2000, forestCover: 7310, deforestationRate: 0.8, events: ['Baseline measurement'] },
  { year: 2002, forestCover: 7155, deforestationRate: 1.1, events: ['Civil war intensifies'] },
  { year: 2005, forestCover: 6890, deforestationRate: 1.3, events: ['Drought period begins'] },
  { year: 2008, forestCover: 6580, deforestationRate: 1.5, events: ['Charcoal export ban (ineffective)'] },
  { year: 2010, forestCover: 6420, deforestationRate: 1.2, events: ['Famine conditions'] },
  { year: 2012, forestCover: 6190, deforestationRate: 1.8, events: ['Al-Shabaab control of charcoal trade'] },
  { year: 2015, forestCover: 5890, deforestationRate: 1.6, events: ['UN charcoal embargo'] },
  { year: 2018, forestCover: 5620, deforestationRate: 1.5, events: ['PROSCAL project begins'] },
  { year: 2020, forestCover: 5480, deforestationRate: 1.3, events: ['COVID-19 impact'] },
  { year: 2022, forestCover: 5280, deforestationRate: 1.8, events: ['Severe drought returns'] },
  { year: 2024, forestCover: 5180, deforestationRate: 1.03, events: ['Current assessment'] },
  { year: 2025, forestCover: 5120, deforestationRate: 1.2, events: ['Projected (no intervention)'] }
];

export default function TimelineSlider() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isPlaying, setIsPlaying] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const selectedData = timelineData.find(d => d.year === selectedYear) || timelineData[0];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const container = svg
      .attr('width', 800)
      .attr('height', 300)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(timelineData, d => d.year) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(timelineData, d => d.forestCover) as [number, number])
      .range([height, 0]);

    // Line generator
    const line = d3.line<DataPoint>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.forestCover))
      .curve(d3.curveMonotoneX);

    // Add axes
    container.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d.toString()));

    container.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}K ha`));

    // Add axis labels
    container.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Forest Cover (Thousands of Hectares)');

    container.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Year');

    // Add the line
    container.append('path')
      .datum(timelineData)
      .attr('fill', 'none')
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots for each data point
    container.selectAll('.dot')
      .data(timelineData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.forestCover))
      .attr('r', d => d.year === selectedYear ? 8 : 4)
      .attr('fill', d => d.year === selectedYear ? '#DC2626' : '#EF4444')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => setSelectedYear(d.year));

    // Add selected year indicator line
    const selectedX = xScale(selectedYear);
    container.append('line')
      .attr('x1', selectedX)
      .attr('x2', selectedX)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.7);

  }, [selectedYear]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedYear(prev => {
          const currentIndex = timelineData.findIndex(d => d.year === prev);
          const nextIndex = (currentIndex + 1) % timelineData.length;
          return timelineData[nextIndex].year;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Somalia Forest Cover Timeline
          </h3>
          <p className="text-gray-600">
            Interactive timeline showing forest loss from 2000-2025
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          
          <button
            onClick={() => setSelectedYear(2000)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>

      {/* Year Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selected Year: {selectedYear}
        </label>
        <input
          type="range"
          min={2000}
          max={2025}
          step={1}
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>2000</span>
          <span>2025</span>
        </div>
      </div>

      {/* Current Data Display */}
      <motion.div
        key={selectedYear}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Forest Cover */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {selectedData.forestCover.toLocaleString()}K ha
          </div>
          <div className="text-sm text-gray-600">Forest Cover Remaining</div>
        </div>

        {/* Deforestation Rate */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {selectedData.deforestationRate}%
          </div>
          <div className="text-sm text-gray-600">Annual Deforestation Rate</div>
        </div>

        {/* Events */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Key Events</div>
          <div className="text-sm text-gray-600">
            {selectedData.events.join(', ')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}