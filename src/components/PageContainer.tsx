import React from 'react';
import { Header } from './Header';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';

interface PageContainerProps {
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  customHeader?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A reusable page container component with built-in loading and error states
 */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  title, 
  isLoading = false, 
  isError = false, 
  errorMessage,
  customHeader,
  children 
}) => {  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {customHeader || <Header header={title} />}
        <LoadingState fullHeight={true} />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="flex flex-col h-full">
        {customHeader || <Header header={title} />}
        <ErrorState message={errorMessage} fullHeight={true} />
      </div>
    );
  }

  // Show content
  return (
    <div className="flex flex-col h-full">
      {customHeader || <Header header={title} />}
      {children}
    </div>
  );
};
