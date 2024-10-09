import React from 'react';

interface RouteProps {
  param?: string;
  index?: boolean;
  element: React.ReactNode;
  regex?: boolean;
}

export const Route: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};