'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'gray' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(({
  children,
  variant = 'default',
  size = 'lg',
  animate = true,
  className = '',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white',
    gray: 'bg-gray-50',
    dark: 'bg-primary-800 text-white'
  };

  const sizes = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
    xl: 'py-24'
  };

  const classes = `${variants[variant]} ${sizes[size]} ${className}`;

  if (animate) {
    return (
      <motion.section
        ref={ref}
        className={classes}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        {...(props as any)}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <section ref={ref} className={classes} {...props}>
      {children}
    </section>
  );
});

Section.displayName = 'Section';

// Section subcomponents
export const SectionHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-center mb-16 ${className}`} {...props}>
    {children}
  </div>
);

export const SectionTitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 ${className}`} {...props}>
    {children}
  </h2>
);

export const SectionSubtitle = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const SectionContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`max-w-7xl mx-auto px-6 ${className}`} {...props}>
    {children}
  </div>
);

export default Section;