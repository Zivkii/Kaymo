'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface SpeciesData {
  category: string;
  threatened: number;
  total: number;
  criticallyEndangered: number;
  color: string;
  icon: string;
}

const biodiversityData: SpeciesData[] = [
  {
    category: 'Mammals',
    threatened: 12,
    total: 114,
    criticallyEndangered: 3,
    color: '#DC2626',
    icon: '🦁'
  },
  {
    category: 'Birds',
    threatened: 15,
    total: 727,
    criticallyEndangered: 2,
    color: '#7C3AED',
    icon: '🦅'
  },
  {
    category: 'Reptiles',
    threatened: 8,
    total: 235,
    criticallyEndangered: 1,
    color: '#059669',
    icon: '🦎'
  },
  {
    category: 'Plants',
    threatened: 45,
    total: 3847,
    criticallyEndangered: 8,
    color: '#EA580C',
    icon: '🌿'
  },
  {
    category: 'Fish',
    threatened: 28,
    total: 2100,
    criticallyEndangered: 4,
    color: '#2563EB',
    icon: '🐟'
  }
];

export default function BiodiversityChart() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2 - 40;

    const container = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Calculate threat percentages
    const dataWithPercentages = biodiversityData.map(d => ({
      ...d,
      threatPercentage: (d.threatened / d.total) * 100
    }));

    // Create pie chart for threat percentages
    const pie = d3.pie<typeof dataWithPercentages[0]>()
      .value(d => d.threatened)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<typeof dataWithPercentages[0]>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const pieData = pie(dataWithPercentages);

    // Draw pie slices
    container.selectAll('.arc')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .each(function(d) {
        const group = d3.select(this);
        
        // Pie slice
        group.append('path')
          .attr('d', arc)
          .attr('fill', (d: any) => d.data.color)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 2)
          .style('opacity', 0.8)
          .style('cursor', 'pointer')
          .on('mouseover', function(event: any, d: any) {
            d3.select(this).style('opacity', 1);
            setSelectedCategory(d.data.category);
          })
          .on('mouseout', function() {
            d3.select(this).style('opacity', 0.8);
            setSelectedCategory(null);
          });

        // Labels
        const labelArc = d3.arc<d3.PieArcDatum<typeof dataWithPercentages[0]>>()
          .innerRadius(radius * 0.8)
          .outerRadius(radius * 0.8);

        group.append('text')
          .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('font-size', '24px')
          .text((d: any) => d.data.icon);
      });

    // Center text
    container.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text('218');

    container.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '14px')
      .style('fill', '#6B7280')
      .text('Species');

    container.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.2em')
      .style('font-size', '14px')
      .style('fill', '#6B7280')
      .text('Threatened');

  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart */}
        <div className="flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Threatened Species by Category
          </h3>
          <svg ref={svgRef} className="w-full h-auto"></svg>
        </div>

        {/* Legend and Details */}
        <div className="flex-1 space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Biodiversity Under Threat
          </h4>
          
          {biodiversityData.map((species) => (
            <motion.div
              key={species.category}
              className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                selectedCategory === species.category
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setSelectedCategory(species.category)}
              onHoverEnd={() => setSelectedCategory(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{species.icon}</span>
                  <span className="font-semibold text-gray-800">
                    {species.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: species.color }}>
                    {species.threatened} threatened
                  </div>
                  <div className="text-xs text-gray-500">
                    of {species.total.toLocaleString()} total
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(species.threatened / species.total) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: species.color }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{((species.threatened / species.total) * 100).toFixed(1)}% threatened</span>
                <span>{species.criticallyEndangered} critically endangered</span>
              </div>
            </motion.div>
          ))}
          
          {/* Summary */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 font-bold text-lg">⚠️</span>
              <span className="font-semibold text-red-800">Critical Impact</span>
            </div>
            <p className="text-sm text-red-700">
              Forest habitat loss threatens 218 species across Somalia, with 18 critically endangered. 
              Deforestation fragments ecosystems and eliminates nesting sites, food sources, and migration corridors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}