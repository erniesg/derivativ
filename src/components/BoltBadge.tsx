import React from 'react';

interface BoltBadgeProps {
  variant?: 'white' | 'black' | 'text';
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
  className?: string;
}

const BoltBadge: React.FC<BoltBadgeProps> = ({ 
  variant = 'black', 
  position = 'bottom-right',
  className = '' 
}) => {
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50',
    'bottom-right': 'fixed bottom-4 right-4 z-50',
    'bottom-left': 'fixed bottom-4 left-4 z-50',
    'top-left': 'fixed top-4 left-4 z-50'
  };

  const getBadgeContent = () => {
    switch (variant) {
      case 'white':
        return (
          <div className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L20.944 11.056L32 16L20.944 20.944L16 30L11.056 20.944L0 16L11.056 11.056L16 2Z" fill="#000000"/>
            </svg>
          </div>
        );
      case 'black':
        return (
          <div className="bg-black rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L20.944 11.056L32 16L20.944 20.944L16 30L11.056 20.944L0 16L11.056 11.056L16 2Z" fill="#FFFFFF"/>
            </svg>
          </div>
        );
      case 'text':
        return (
          <div className="bg-black text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center space-x-2">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L20.944 11.056L32 16L20.944 20.944L16 30L11.056 20.944L0 16L11.056 11.056L16 2Z" fill="#FFFFFF"/>
              </svg>
              <span className="text-sm font-medium">Built with Bolt</span>
            </div>
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
      className={`${positionClasses[position]} hover:scale-105 transition-transform duration-200 ${className}`}
      aria-label="Built with Bolt.new"
    >
      {getBadgeContent()}
    </a>
  );
};

export default BoltBadge;