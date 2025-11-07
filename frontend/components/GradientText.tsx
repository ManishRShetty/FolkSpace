import React from 'react';

type GradientTextProps = {
  children: React.ReactNode;
  /** Optional, for adding other styles like font-size, weight, etc. */
  className?: string;
};

const GradientText = ({ children, className }: GradientTextProps) => {
  // These are the core Tailwind classes for the gradient
  const gradientClasses = 
    "bg-gradient-to-r from-[#6BECD9] via-[#0C55B1] to-[#8F55B5]";

  // These classes clip the background to the text
  const textClipClasses = "bg-clip-text text-transparent";

  // Combine all classes
  const combinedClassName = `
    ${gradientClasses} 
    ${textClipClasses} 
    ${className || ''}
  `;

  return (
    <span className={combinedClassName}>
      {children}
    </span>
  );
};

export default GradientText;