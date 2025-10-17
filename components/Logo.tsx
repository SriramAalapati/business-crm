import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CRM Pro Logo"
    >
      <path 
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
        className="stroke-current text-primary-500" 
        strokeWidth="2"
      />
      <path 
        d="M16.5 7.5C15.223 8.35623 14.2259 9.60114 13.6334 11.0504C13.0409 12.4996 12.8795 14.0734 13.1728 15.5833C13.4661 17.0932 14.2013 18.4735 15.2679 19.5401C16.3345 20.6067 17.7148 21.3419 19.2247 21.6352" 
        className="stroke-current text-primary-300/70 dark:text-primary-700/70"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;
