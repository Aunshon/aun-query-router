// import { FC } from '@wordpress/element/node_modules/@types/react';
//
// interface RouteProps {
//   param?: string;
//   index?: boolean;
//   element: React.ReactNode;
// }
//
// // @ts-ignore
// export const Route: FC<RouteProps> = ({ element }) => {
//   return element;
// };


import React from 'react';

interface RouteProps {
  param?: string;
  index?: boolean;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};