import React from 'react';

interface ErrorStateProps {
  message?: string;
  fullHeight?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'An error occurred. Please try again later.',
  fullHeight = false
}) => {
  const containerClasses = fullHeight 
    ? "flex-1 flex items-center justify-center" 
    : "";

  return (
    <div className={containerClasses}>
      <div className="text-red-500 text-center">
        {message}
      </div>
    </div>
  );
};
