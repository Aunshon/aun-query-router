import React from 'react';
import { useQueryNavigation } from '../hooks/useQueryNavigation';

interface QueryLinkProps {
  param: string;
  to: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const QueryLink: React.FC<QueryLinkProps> = ({ param, to, children, ...props }) => {
  const { navigateLink } = useQueryNavigation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateLink({ [param]: to });
  };
  return <a href="#" onClick={handleClick} {...props}>{children}</a>;
};