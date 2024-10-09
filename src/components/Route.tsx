import React from 'react';

interface RouteProps {
  param?: string;
  index?: boolean;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};