import React, { createContext, useMemo } from 'react';
import { useWatchParam } from '../hooks/useWatchParam';
import { useQueryNavigation } from '../hooks/useQueryNavigation';

interface RoutesProps {
  children: React.ReactNode;
  paramWatcher: string;
  routerName?: string;
}

type MiddlewareFunction = (
  params: Record<string, string>,
  next: () => React.ReactNode | null,
  redirect: (to: string) => React.ReactNode | null
) => React.ReactNode | void;

export const Routes: React.FC<RoutesProps> = ({ children, paramWatcher, routerName = `aun-react-query-router-${new Date().getTime()}` }) => {
  const RouterContext = createContext(routerName);
  const params = useWatchParam([paramWatcher]);
  const currentPath = useMemo(() => params[paramWatcher] || '', [params, paramWatcher]);
  const { navigateLink } = useQueryNavigation();

  const contextValue = useMemo(() => ({ currentPath, paramWatcher }), [currentPath, paramWatcher]);

  const renderedRoute = useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    const findRoute = ( path: string ) => {
      return childrenArray.find((child: any) => {
        if (child.props.index && path === '') {
          return true;
        }

        if (child.props.regex) {
          const regex = new RegExp(child.props.param);
          return regex.test(path);
        }

        return child.props.param === path;
      });
    }

    const findAndRenderRoute = (path: string): any => {
      const matchedRoute = findRoute( path );

      if (matchedRoute) {
        const routeProps = (matchedRoute as any).props;
        let routeParams: Record<string, string> = {};

        if (routeProps.regex) {
          const regex = new RegExp(routeProps.param);
          const match = path.match(regex);
          // @ts-ignore
          routeParams = match ? match.groups || {} : {};
        }

        return React.cloneElement(routeProps.element, { params: routeParams });
      }

      if ( path !== '*'  ) {
        return findAndRenderRoute( '*' );
      }

      return null;
    };

    const runMiddleware = (middlewares: MiddlewareFunction[], routeParams: Record<string, string>, index: number = 0): any => {
      const next = () => {
        if (index < middlewares.length - 1) {
          return runMiddleware(middlewares, routeParams, index + 1);
        } else {
          return findAndRenderRoute(currentPath);
        }
      };

      const redirect = (to: string) => {
        navigateLink({ [paramWatcher]: to });
        return findAndRenderRoute(to);
      };

      return middlewares[index](routeParams, next, redirect);
    };

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

    if (matchedRoute) {
      const routeProps = (matchedRoute as any).props;
      let routeParams: Record<string, string> = {};

      if (routeProps.regex) {
        const regex = new RegExp(routeProps.param);
        const match = currentPath.match(regex);
        // @ts-ignore
        routeParams = match ? match.groups || {} : {};
      }

      if (routeProps.middleware) {
        const middlewares = Array.isArray(routeProps.middleware) ? routeProps.middleware : [routeProps.middleware];
        return runMiddleware(middlewares, routeParams);
      }

      return React.cloneElement(routeProps.element, { params: routeParams });
    }

    return findAndRenderRoute( '*' );
  }, [children, currentPath, navigateLink, paramWatcher]);

  return (
    // @ts-ignore
    <RouterContext.Provider value={contextValue}>
      {renderedRoute}
    </RouterContext.Provider>
  );
};