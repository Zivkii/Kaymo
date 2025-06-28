'use client';

import { motion } from 'framer-motion';
import Section, { SectionContent, SectionHeader, SectionTitle, SectionSubtitle } from '@/components/ui/Section';
import Card, { CardContent } from '@/components/ui/Card';
import BiodiversityChart from '@/components/visualizations/BiodiversityChart';
import ClimateImpactChart from '@/components/visualizations/ClimateImpactChart';
import Button from '@/components/ui/Button';

interface ImpactCardProps {
  icon: string;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string; color: string }>;
  delay?: number;
}

const ImpactCard = ({ icon, title, description, stats, delay = 0 }: ImpactCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="p-6 h-full">
      <CardContent className="p-0">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">{icon}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: delay + (index * 0.1) }}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-sm text-gray-600">{stat.label}</span>
              <span className={`font-bold ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const economicImpacts = [
  {
    category: 'Direct Economic Losses',
    value: '$216M',
    description: 'Annual cost of environmental degradation',
    trend: '+15% annually'
  },
  {
    category: 'Agricultural Productivity',
    value: '35%',
    description: 'Decline in crop yields due to soil degradation',
    trend: 'Worsening'
  },
  {
    category: 'Water Scarcity Costs',
    value: '$89M',
    description: 'Additional costs for water access and treatment',
    trend: '+12% annually'
  },
  {
    category: 'Health Care Costs',
    value: '$45M',
    description: 'Respiratory and malnutrition-related expenses',
    trend: 'Rising'
  }
];

export default function ImpactsSection() {
  return (
    <Section id="impacts" variant="gray" size="xl">
      <SectionContent>
        {/* Header */}
        <SectionHeader>
          <SectionTitle>
            The Ripple Effects
          </SectionTitle>
          <SectionSubtitle>
            Deforestation creates a cascade of environmental, social, and economic impacts 
            that extend far beyond the loss of trees. Explore how forest destruction affects 
            biodiversity, climate, communities, and Somalia's future.
          </SectionSubtitle>
        </SectionHeader>

        {/* Impact Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ImpactCard
            icon="🦋"
            title="Biodiversity Loss"
            description="Forest destruction eliminates habitats and threatens endemic species"
            stats={[
              { label: 'Species threatened', value: '218', color: 'text-red-600' },
              { label: 'Critically endangered', value: '18', color: 'text-red-700' },
              { label: 'Habitat loss rate', value: '1.03%/yr', color: 'text-orange-600' }
            ]}
            delay={0}
          />
          
          <ImpactCard
            icon="🌡️"
            title="Climate Change"
            description="Deforestation accelerates warming and reduces carbon sequestration"
            stats={[
              { label: 'CO₂ emissions', value: '9.2M tons', color: 'text-red-600' },
              { label: 'Temperature rise', value: '+2.1°C', color: 'text-orange-600' },
              { label: 'Carbon storage lost', value: '15M tons', color: 'text-yellow-600' }
            ]}
            delay={0.1}
          />
          
          <ImpactCard
            icon="💧"
            title="Water Security"
            description="Forest loss disrupts watersheds and reduces water availability"
            stats={[
              { label: 'Rainfall decline', value: '48%', color: 'text-blue-600' },
              { label: 'Groundwater depletion', value: '2.3m/yr', color: 'text-blue-700' },
              { label: 'Wells dried up', value: '1,847', color: 'text-red-600' }
            ]}
            delay={0.2}
          />
          
          <ImpactCard
            icon="👥"
            title="Human Impact"
            description="Communities face displacement, food insecurity, and health issues"
            stats={[
              { label: 'People affected', value: '2.1M', color: 'text-red-600' },
              { label: 'Food insecure', value: '6.4M', color: 'text-orange-600' },
              { label: 'Respiratory illness', value: '+67%', color: 'text-yellow-600' }
            ]}
            delay={0.3}
          />
        </div>

        {/* Biodiversity Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Biodiversity Under Threat
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Forest habitat loss threatens 218 species across multiple categories. 
              Hover over each section to explore the impact on different animal and plant groups.
            </p>
          </div>
          <BiodiversityChart />
        </motion.div>

        {/* Climate Impact Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Climate & Environmental Indicators
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Track how deforestation drives climate change and environmental degradation. 
              Switch between different indicators to see 24 years of worsening conditions.
            </p>
          </div>
          <ClimateImpactChart />
        </motion.div>

        {/* Economic Impact Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Economic Consequences
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Environmental degradation creates massive economic costs that burden 
              Somalia's development and threaten long-term prosperity.
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Total Annual Cost</h4>
                    <p className="text-gray-600">Environmental degradation impact</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">$216M</div>
                    <div className="text-sm text-gray-500">Per year</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {economicImpacts.map((impact, index) => (
                    <motion.div
                      key={impact.category}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{impact.category}</div>
                        <div className="text-sm text-gray-600">{impact.description}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-red-600">{impact.value}</div>
                        <div className="text-xs text-gray-500">{impact.trend}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            The Time for Action is Now
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Somalia's forests and the communities that depend on them face an unprecedented crisis. 
            But with coordinated action, sustainable solutions, and international support, 
            we can reverse this trend and build a more resilient future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-gray-100"
              onClick={() => {
                const nextSection = document.getElementById('solutions');
                nextSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Solutions
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              Support Conservation
            </Button>
          </div>
        </motion.div>
      </SectionContent>
    </Section>
  );
}