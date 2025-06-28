'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  animate?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  hover = true,
  animate = true,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseClasses = "rounded-xl transition-all duration-300";
  
  const variants = {
    default: "bg-white shadow-lg border border-gray-100",
    elevated: "bg-white shadow-xl border border-gray-200",
    outlined: "bg-white border-2 border-gray-200 shadow-sm"
  };

  const hoverClasses = hover ? "hover:shadow-xl hover:border-gray-200 hover:-translate-y-1" : "";
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={classes}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pb-0 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;