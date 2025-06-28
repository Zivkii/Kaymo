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
    warning: 'from-[#5E6AD2] to-[#7d9df7]',
    red: 'from-[#8ba3f2] to-[#a5b9f7]',
    green: 'from-[#7d9df7] to-[#6275e5]',
    blue: 'from-[#6275e5] to-[#5E6AD2]',
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
      <Card className="p-8 relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/8">
        {/* Background Gradient */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorClasses[color]}`} />
        
        {/* Content */}
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{title}</h3>
          
          <div className="text-4xl font-bold text-[#5E6AD2] mb-2 font-mono">
            {value}
          </div>
          
          <p className="text-white/70 mb-4 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
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
    <Section id="key-metrics" className="bg-[#101014]" size="lg">
      <SectionContent>
        {/* Section Header */}
        <SectionHeader>
          <SectionTitle className="text-white">
            The Scale of the Crisis
          </SectionTitle>
          <SectionSubtitle className="text-white/70">
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
          <p className="text-lg text-white/70 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            These numbers represent more than statistics—they tell the story of a nation's environmental heritage at risk.
          </p>
          <motion.button
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-[#5E6AD2] hover:bg-[#7d9df7] transition-colors text-white text-base shadow-lg border border-white/10 mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const nextSection = document.getElementById('causes');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore the Causes</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
        </motion.div>
      </SectionContent>
    </Section>
  );
}