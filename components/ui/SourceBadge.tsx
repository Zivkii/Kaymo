'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SourceBadgeProps {
  source: string;
  type: 'un' | 'world-bank' | 'academic' | 'government' | 'ngo';
  citation?: string;
  methodology?: string;
  lastVerified?: string;
  trustScore?: number;
}

const SourceBadge = ({ 
  source, 
  type, 
  citation = '', 
  methodology = '', 
  lastVerified = '', 
  trustScore = 85 
}: SourceBadgeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const typeConfig = {
    'un': { 
      color: 'bg-blue-500', 
      icon: '🔵', 
      label: 'UN/International',
      trust: 95 
    },
    'world-bank': { 
      color: 'bg-green-500', 
      icon: '🟢', 
      label: 'World Bank',
      trust: 90 
    },
    'academic': { 
      color: 'bg-orange-500', 
      icon: '🟠', 
      label: 'Academic',
      trust: 85 
    },
    'government': { 
      color: 'bg-purple-500', 
      icon: '🟣', 
      label: 'Government',
      trust: 75 
    },
    'ngo': { 
      color: 'bg-yellow-500', 
      icon: '🟡', 
      label: 'NGO/Local',
      trust: 70 
    }
  };

  const config = typeConfig[type];
  const actualTrustScore = trustScore || config.trust;

  return (
    <div className="relative inline-block">
      <motion.div
        className="flex items-center gap-1 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
      >
        <div className={`w-3 h-3 ${config.color} rounded-full`} />
        <span className="text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors">
          {source}
        </span>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{config.icon}</span>
                <span className="font-semibold text-gray-900">{source}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  actualTrustScore >= 90 ? 'bg-green-500' :
                  actualTrustScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-600">{actualTrustScore}% trust</span>
              </div>
            </div>

            {/* Source Type */}
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {config.label}
              </span>
            </div>

            {/* Citation */}
            {citation && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-700 mb-1">Citation:</div>
                <div className="text-xs text-gray-600 leading-relaxed">{citation}</div>
              </div>
            )}

            {/* Methodology */}
            {methodology && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-700 mb-1">Methodology:</div>
                <div className="text-xs text-gray-600 leading-relaxed">{methodology}</div>
              </div>
            )}

            {/* Last Verified */}
            {lastVerified && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-700 mb-1">Last Verified:</div>
                <div className="text-xs text-gray-600">{lastVerified}</div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-100 pt-2 mt-3">
              <button className="text-xs text-primary-600 hover:text-primary-800 font-medium transition-colors">
                View Full Report →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SourceBadge;