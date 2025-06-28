'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Card, { CardContent } from '@/components/ui/Card';
import SourceBadge from '@/components/ui/SourceBadge';
import Section, { SectionContent, SectionHeader, SectionTitle, SectionSubtitle } from '@/components/ui/Section';
import Button from '@/components/ui/Button';

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  source: string;
  color: 'warning' | 'red' | 'green' | 'blue';
  delay?: number;
}

const MetricCard = ({ title, value, description, source, color, delay = 0 }: MetricCardProps) => {
  const colorClasses = {
    warning: 'from-warning-500 to-warning-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
  };

  const sourceTypeMap: Record<string, 'un' | 'world-bank' | 'academic' | 'government' | 'ngo'> = {
    'FAO 2024': 'un',
    'Global Forest Watch': 'un',
    'World Bank 2023': 'world-bank',
    'IUCN Red List 2023': 'un',
    'UNEP 2024': 'un',
    'UNEP PROSCAL 2024': 'un'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <Card className="p-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorClasses[color]}`} />
        
        {/* Content */}
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
          
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {value}
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {description}
          </p>
          
          {/* Source Badge */}
          <SourceBadge 
            source={source}
            type={sourceTypeMap[source] || 'academic'}
            citation={`${source}: ${description}`}
            methodology="Remote sensing analysis and ground-truth verification"
            lastVerified="January 2024"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function KeyMetrics() {
  return (
    <Section id="key-metrics" variant="gray" size="lg">
      <SectionContent>
        {/* Section Header */}
        <SectionHeader>
          <SectionTitle>
            The Scale of the Crisis
          </SectionTitle>
          <SectionSubtitle>
            Somalia's forests are disappearing at an alarming rate. Here are the key numbers 
            that tell the story of environmental degradation and its far-reaching consequences.
          </SectionSubtitle>
        </SectionHeader>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <MetricCard
            title="Annual Deforestation Rate"
            value="1.03%"
            description="Somalia loses over 1% of its forest cover every year, one of the highest rates globally."
            source="FAO 2024"
            color="warning"
            delay={0}
          />
          
          <MetricCard
            title="Forest Cover Lost"
            value="686,000 ha"
            description="Total hectares of forest lost since 2000, equivalent to an area larger than Delaware."
            source="Global Forest Watch"
            color="red"
            delay={0.1}
          />
          
          <MetricCard
            title="Charcoal Export Value"
            value="$38-56M"
            description="Annual revenue from charcoal exports, the primary driver of deforestation."
            source="World Bank 2023"
            color="warning"
            delay={0.2}
          />
          
          <MetricCard
            title="Threatened Species"
            value="218"
            description="Number of species on the IUCN Red List threatened by habitat loss."
            source="IUCN Red List 2023"
            color="red"
            delay={0.3}
          />
          
          <MetricCard
            title="Economic Impact"
            value="$216M"
            description="Estimated annual economic cost of environmental degradation."
            source="UNEP 2024"
            color="red"
            delay={0.4}
          />
          
          <MetricCard
            title="Reforestation Progress"
            value="12,500 ha"
            description="Area successfully reforested through international initiatives like PROSCAL."
            source="UNEP PROSCAL 2024"
            color="green"
            delay={0.5}
          />
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            These numbers represent more than statistics—they tell the story of a nation's environmental heritage at risk.
          </p>
          <Button 
            size="lg"
            onClick={() => {
              const nextSection = document.getElementById('causes');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore the Causes
          </Button>
        </motion.div>
      </SectionContent>
    </Section>
  );
}