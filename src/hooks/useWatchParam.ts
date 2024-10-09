import { useState, useEffect, useRef } from 'react';

export const useWatchParam = (params: string[]) => {
  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return params.reduce((acc, param) => {
      if (searchParams.has(param)) {
        acc[param] = searchParams.get(param)!;
      }
      return acc;
    }, {} as Record<string, string>);
  });

  const prevParamsRef = useRef<Record<string, string>>({});

  useEffect(() => {
    const handleUrlChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const newParams: Record<string, string> = {};
      let hasChanged = false;

      params.forEach(param => {
        const value = searchParams.get(param);
        if (value !== null) {
          newParams[param] = value;
          if (prevParamsRef.current[param] !== value) {
            hasChanged = true;
          }
        } else if (param in prevParamsRef.current) {
          hasChanged = true;
        }
      });

      if (hasChanged) {
        setQueryParams(newParams);
        prevParamsRef.current = newParams;
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange);
    window.addEventListener('replacestate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
      window.removeEventListener('replacestate', handleUrlChange);
    };
  }, [params]);

  return queryParams;
};
