import React from 'react';

interface LoadingStateProps {
  fullHeight?: boolean;
}

/**
 * A reusable loading spinner component
 * @param fullHeight - When true, the spinner is centered in a full-height container
 */
export const LoadingState: React.FC<LoadingStateProps> = ({ fullHeight = false }) => {
  const containerClasses = fullHeight 
    ? "flex justify-center items-center h-full" 
    : "flex justify-center items-center h-32";
    
  return (
    <div className={containerClasses}>
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
    </div>
  );
};
