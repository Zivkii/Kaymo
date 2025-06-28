'use client';

import { motion } from 'framer-motion';
import Section, { SectionContent, SectionHeader, SectionTitle, SectionSubtitle } from '@/components/ui/Section';
import Card, { CardContent } from '@/components/ui/Card';
import TimelineSlider from '@/components/visualizations/TimelineSlider';
import RegionalComparison from '@/components/visualizations/RegionalComparison';

interface CauseCardProps {
  icon: string;
  title: string;
  description: string;
  impact: string;
  percentage: number;
  color: string;
  delay?: number;
}

const CauseCard = ({ icon, title, description, impact, percentage, color, delay = 0 }: CauseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-0">
        {/* Icon and percentage */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          <div className={`text-2xl font-bold ${color}`}>
            {percentage}%
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Impact */}
        <div className="border-t border-gray-100 pt-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Primary Impact
          </div>
          <div className="text-sm font-medium text-gray-800">
            {impact}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: delay + 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${
                color.includes('red') ? 'from-red-400 to-red-600' :
                color.includes('orange') ? 'from-orange-400 to-orange-600' :
                color.includes('yellow') ? 'from-yellow-400 to-yellow-600' :
                'from-blue-400 to-blue-600'
              }`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const causesData = [
  {
    icon: '🔥',
    title: 'Charcoal Production',
    description: 'Illegal charcoal trade drives 65% of deforestation. Despite export bans, charcoal remains a primary income source, generating $38-56M annually.',
    impact: 'Direct tree cutting for fuel production',
    percentage: 65,
    color: 'text-red-600'
  },
  {
    icon: '🌵',
    title: 'Drought & Climate Change',
    description: 'Recurring droughts stress forests and force communities to exploit remaining trees for survival. Climate change intensifies dry conditions.',
    impact: 'Forest stress and degradation',
    percentage: 20,
    color: 'text-orange-600'
  },
  {
    icon: '🏘️',
    title: 'Agricultural Expansion',
    description: 'Growing population and food insecurity drive clearing of forests for farmland and grazing. Limited arable land increases pressure.',
    impact: 'Land conversion for food production',
    percentage: 10,
    color: 'text-yellow-600'
  },
  {
    icon: '⚖️',
    title: 'Weak Governance',
    description: 'Limited government control, inadequate enforcement of environmental laws, and corruption enable illegal logging and trade.',
    impact: 'Lack of forest protection enforcement',
    percentage: 5,
    color: 'text-blue-600'
  }
];

export default function CausesSection() {
  return (
    <Section id="causes" variant="default" size="xl">
      <SectionContent>
        {/* Header */}
        <SectionHeader>
          <SectionTitle>
            Understanding the Drivers
          </SectionTitle>
          <SectionSubtitle>
            Multiple interconnected factors contribute to Somalia's rapid forest loss. 
            Explore the data to understand how economic pressures, climate change, and governance 
            challenges combine to threaten the nation's forests.
          </SectionSubtitle>
        </SectionHeader>

        {/* Causes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {causesData.map((cause, index) => (
            <CauseCard
              key={cause.title}
              {...cause}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Historical Timeline: 25 Years of Forest Loss
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track how key events and policy changes have impacted Somalia's forests from 2000 to 2025. 
              Click on any year or use the play button to see the progression.
            </p>
          </div>
          <TimelineSlider />
        </motion.div>

        {/* Regional Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Regional Context: East Africa Comparison
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how Somalia's deforestation compares to neighboring countries. 
              Switch between different metrics to understand regional patterns and correlations.
            </p>
          </div>
          <RegionalComparison />
        </motion.div>

        {/* Key Takeaways */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-8 mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Key Takeaways
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">65%</div>
              <div className="text-sm font-medium text-gray-800 mb-2">Charcoal Production</div>
              <div className="text-xs text-gray-600">Primary driver of deforestation</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">1.03%</div>
              <div className="text-sm font-medium text-gray-800 mb-2">Annual Loss Rate</div>
              <div className="text-xs text-gray-600">Highest in East Africa</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">686K</div>
              <div className="text-sm font-medium text-gray-800 mb-2">Hectares Lost</div>
              <div className="text-xs text-gray-600">Since 2000</div>
            </div>
          </div>
        </motion.div>
      </SectionContent>
    </Section>
  );
}