import React from 'react';

interface ErrorStateProps {
  message?: string;
  fullHeight?: boolean;
}

/**
 * A reusable error message component
 * @param message - The error message to display
 * @param fullHeight - When true, the error is centered in a full-height container
 */
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
