import React from 'react';

interface RouteProps {
  param?: string;
  index?: boolean;
  element: React.ReactNode;
  regex?: boolean;
  middleware?: MiddlewareFunction | MiddlewareFunction[];
}

type MiddlewareFunction = (
  params: Record<string, string>,
  next: () => React.ReactNode,
  redirect: (to: string) => void
) => React.ReactNode | void;

export const Route: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};