import React from 'react';

interface BoltBadgeProps {
  variant?: 'white' | 'black' | 'text';
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  variant = 'black', 
  position = 'bottom-right',
  className = '',
  size = 'md'
}) => {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50'
  };

  const sizeClasses = {
    'sm': 'w-8 h-8',
    'md': 'w-12 h-12',
    'lg': 'w-16 h-16'
  };

  const getBadgeContent = () => {
    switch (variant) {
      case 'white':
        return (
          <div className="hover:scale-105 transition-transform duration-200 drop-shadow-lg">
            <img
              src="/white_circle_360x360.png"
              alt="Built with Bolt.new"
              className={`${sizeClasses[size]} object-contain`}
            />
          </div>
        );
      case 'black':
        return (
          <div className="hover:scale-105 transition-transform duration-200 drop-shadow-lg">
            <img
              src="/black_circle_360x360.png"
              alt="Built with Bolt.new"
              className={`${sizeClasses[size]} object-contain`}
            />
          </div>
        );
      case 'text':
        return (
          <div className="hover:scale-105 transition-transform duration-200 drop-shadow-lg">
            <img
              src="/logotext_poweredby_360w.png"
              alt="Powered by Bolt.new"
              className="h-8 w-auto object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      className={`${positionClasses[position]} ${className}`}
      aria-label="Built with Bolt.new"
    >
      {getBadgeContent()}
    </a>
  );
};

export default BoltBadge;