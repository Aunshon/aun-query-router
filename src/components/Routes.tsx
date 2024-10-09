import React, { createContext, useMemo } from 'react';
import { useWatchParam } from '../hooks/useWatchParam';

interface RoutesProps {
  children: React.ReactNode;
  paramWatcher: string;
  routerName?: string;
}

export const Routes: React.FC<RoutesProps> = ({ children, paramWatcher, routerName = `aun-query-router-${new Date().getTime()}` }) => {
  const RouterContext = createContext(routerName);
  const params = useWatchParam([paramWatcher]);
  const currentPath = useMemo(() => params[paramWatcher] || '', [params, paramWatcher]);

  const contextValue = useMemo(() => ({ currentPath, paramWatcher }), [currentPath, paramWatcher]);

  const renderedRoute = useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    const matchedRoute = childrenArray.find((child: any) =>
      (child.props.param === currentPath) || (child.props.index && currentPath === '')
    );

    const noMatchRoute = childrenArray.find((child: any) => child.props.param === '*');

    return matchedRoute || noMatchRoute || null;
  }, [children, currentPath]);

  return (
    // @ts-ignore
    <RouterContext.Provider value={contextValue}>
      {renderedRoute}
    </RouterContext.Provider>
  );
};