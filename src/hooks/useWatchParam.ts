import { useState, useEffect, useRef } from 'react';

// export const useWatchParam = (params: string[] = []) => {
//   const [queryParams, setQueryParams] = useState(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const initialParams: Record<string, string> = {};
//     if (params.length === 0) {
//       // @ts-ignore
//       for (let [key, value] of searchParams.entries()) {
//         initialParams[key] = value;
//       }
//     } else {
//       params.forEach(param => {
//         if (searchParams.has(param)) {
//           initialParams[param] = searchParams.get(param)!;
//         }
//       });
//     }
//     return initialParams;
//   });
//
//   useEffect(() => {
//     const updateParams = () => {
//       const searchParams = new URLSearchParams(window.location.search);
//       const newParams: Record<string, string> = {};
//       if (params.length === 0) {
//         // @ts-ignore
//         for (let [key, value] of searchParams.entries()) {
//           newParams[key] = value;
//         }
//       } else {
//         params.forEach(param => {
//           if (searchParams.has(param)) {
//             newParams[param] = searchParams.get(param)!;
//           }
//         });
//       }
//       setQueryParams(newParams);
//     };
//
//     window.addEventListener('aun-query-state-changed', updateParams);
//     return () => window.removeEventListener('aun-query-state-changed', updateParams);
//   }, [params]);
//
//   return queryParams;
// };







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
