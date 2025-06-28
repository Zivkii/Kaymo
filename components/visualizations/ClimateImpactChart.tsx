'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface ClimateData {
  year: number;
  temperature: number; // degrees Celsius above baseline
  rainfall: number; // mm per year
  carbonEmissions: number; // million tons CO2 equivalent
  soilDegradation: number; // percentage of arable land affected
}

const climateData: ClimateData[] = [
  { year: 2000, temperature: 0.5, rainfall: 280, carbonEmissions: 2.1, soilDegradation: 15 },
  { year: 2005, temperature: 0.8, rainfall: 245, carbonEmissions: 3.2, soilDegradation: 22 },
  { year: 2010, temperature: 1.1, rainfall: 210, carbonEmissions: 4.8, soilDegradation: 31 },
  { year: 2015, temperature: 1.4, rainfall: 185, carbonEmissions: 6.1, soilDegradation: 38 },
  { year: 2020, temperature: 1.7, rainfall: 165, carbonEmissions: 7.9, soilDegradation: 45 },
  { year: 2024, temperature: 2.1, rainfall: 145, carbonEmissions: 9.2, soilDegradation: 52 }
];

type MetricType = 'temperature' | 'rainfall' | 'carbonEmissions' | 'soilDegradation';

export default function ClimateImpactChart() {
  const [activeMetric, setActiveMetric] = useState<MetricType>('temperature');
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const container = svg
      .attr('width', 600)
      .attr('height', 300)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(climateData, d => d.year) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(climateData, d => d[activeMetric]) as [number, number])
      .range([height, 0]);

    // Line generator
    const line = d3.line<ClimateData>()
      .x(d => xScale(d.year))
      .y(d => yScale(d[activeMetric]))
      .curve(d3.curveMonotoneX);

    // Color based on metric
    const colors = {
      temperature: '#EF4444',
      rainfall: '#3B82F6',
      carbonEmissions: '#F59E0B',
      soilDegradation: '#8B5CF6'
    };

    // Add axes
    container.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d.toString()));

    const yAxisFormat = {
      temperature: (d: d3.NumberValue) => `+${d}°C`,
      rainfall: (d: d3.NumberValue) => `${d}mm`,
      carbonEmissions: (d: d3.NumberValue) => `${d}M tons`,
      soilDegradation: (d: d3.NumberValue) => `${d}%`
    };

    container.append('g')
      .call(d3.axisLeft(yScale).tickFormat(yAxisFormat[activeMetric]));

    // Add the line with animation
    const path = container.append('path')
      .datum(climateData)
      .attr('fill', 'none')
      .attr('stroke', colors[activeMetric])
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate the line
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Add dots
    container.selectAll('.dot')
      .data(climateData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d[activeMetric]))
      .attr('r', 0)
      .attr('fill', colors[activeMetric])
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .transition()
      .duration(2000)
      .delay((d, i) => i * 100)
      .attr('r', 5);

    // Add area under curve for visual impact
    const area = d3.area<ClimateData>()
      .x(d => xScale(d.year))
      .y0(height)
      .y1(d => yScale(d[activeMetric]))
      .curve(d3.curveMonotoneX);

    container.append('path')
      .datum(climateData)
      .attr('fill', colors[activeMetric])
      .attr('opacity', 0.2)
      .attr('d', area);

  }, [activeMetric]);

  const metrics = [
    {
      id: 'temperature' as MetricType,
      label: 'Temperature Rise',
      icon: '🌡️',
      description: 'Average temperature increase',
      current: '+2.1°C',
      trend: 'increasing',
      color: 'text-red-600'
    },
    {
      id: 'rainfall' as MetricType,
      label: 'Rainfall Decline',
      icon: '🌧️',
      description: 'Annual precipitation levels',
      current: '145mm',
      trend: 'decreasing',
      color: 'text-blue-600'
    },
    {
      id: 'carbonEmissions' as MetricType,
      label: 'Carbon Emissions',
      icon: '💨',
      description: 'CO₂ from deforestation',
      current: '9.2M tons',
      trend: 'increasing',
      color: 'text-yellow-600'
    },
    {
      id: 'soilDegradation' as MetricType,
      label: 'Soil Degradation',
      icon: '🏜️',
      description: 'Arable land affected',
      current: '52%',
      trend: 'increasing',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Climate Impact Indicators
        </h3>
        <p className="text-gray-600">
          Track how deforestation contributes to climate change and environmental degradation
        </p>
      </div>

      {/* Metric Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
              activeMetric === metric.id
                ? 'border-primary-300 bg-primary-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{metric.icon}</span>
              <span className="text-sm font-semibold text-gray-800">
                {metric.label}
              </span>
            </div>
            <div className={`text-lg font-bold ${metric.color} mb-1`}>
              {metric.current}
            </div>
            <div className="text-xs text-gray-500">
              {metric.description}
            </div>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-6">
        <svg ref={svgRef} className="w-full h-auto"></svg>
      </div>

      {/* Current Metric Details */}
      <motion.div
        key={activeMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Current Value */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {metrics.find(m => m.id === activeMetric)?.icon}
            </span>
            <span className="font-semibold text-gray-800">
              Current Level
            </span>
          </div>
          <div className={`text-2xl font-bold ${metrics.find(m => m.id === activeMetric)?.color} mb-1`}>
            {metrics.find(m => m.id === activeMetric)?.current}
          </div>
          <div className="text-sm text-gray-600">
            2024 measurement
          </div>
        </div>

        {/* Trend */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              {metrics.find(m => m.id === activeMetric)?.trend === 'increasing' ? '📈' : '📉'}
            </span>
            <span className="font-semibold text-gray-800">24-Year Trend</span>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1">
            {metrics.find(m => m.id === activeMetric)?.trend === 'increasing' ? 'Worsening' : 'Declining'}
          </div>
          <div className="text-sm text-gray-600">
            Since 2000
          </div>
        </div>

        {/* Impact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 font-bold text-lg">⚠️</span>
            <span className="font-semibold text-red-800">Primary Impact</span>
          </div>
          <div className="text-sm text-red-700">
            {activeMetric === 'temperature' && 'Increased heat stress on remaining forests and agriculture'}
            {activeMetric === 'rainfall' && 'Reduced water availability for ecosystems and communities'}
            {activeMetric === 'carbonEmissions' && 'Accelerated global warming from forest loss'}
            {activeMetric === 'soilDegradation' && 'Loss of agricultural productivity and food security'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}