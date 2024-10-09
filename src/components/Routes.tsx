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

    const matchedRoute = childrenArray.find((child: any) => {
      if (child.props.index && currentPath === '') {
        return true;
      }

      if (child.props.regex) {
        const regex = new RegExp(child.props.param);
        return regex.test(currentPath);
      }

      return child.props.param === currentPath;
    });

    const noMatchRoute = childrenArray.find((child: any) => child.props.param === '*');

    if (matchedRoute) {
      const routeProps = (matchedRoute as any).props;
      if (routeProps.regex) {
        const regex = new RegExp(routeProps.param);
        const match = currentPath.match(regex);
        // @ts-ignore
        const params = match ? match.groups || {} : {};
        return React.cloneElement(routeProps.element, { params });
      }
      return React.cloneElement(routeProps.element);
    }

    return noMatchRoute ? React.cloneElement((noMatchRoute as any).props.element) : null;
  }, [children, currentPath]);

  return (
    // @ts-ignore
    <RouterContext.Provider value={contextValue}>
      {renderedRoute}
    </RouterContext.Provider>
  );
};