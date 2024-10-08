// import { useCallback } from '@wordpress/element';
//
// export const useQueryNavigation = () => {
//   const navigateLink = useCallback((params: Record<string, string>) => {
//     const searchParams = new URLSearchParams(window.location.search);
//     // @ts-ignore
//     Object.entries(params).forEach(([key, value]) => {
//       searchParams.set(key, value);
//     });
//     const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
//     window.history.pushState(null, '', newUrl);
//     window.dispatchEvent(new Event('aun-query-state-changed'));
//   }, []);
//
//   const removeLinkParam = useCallback((params: string[]) => {
//     const searchParams = new URLSearchParams(window.location.search);
//     params.forEach(param => {
//       searchParams.delete(param);
//     });
//     const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
//     window.history.pushState(null, '', newUrl);
//     window.dispatchEvent(new Event('aun-query-state-changed'));
//   }, []);
//
//   const replaceLink = useCallback((callback: (params: Record<string, string>) => Record<string, string>) => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const currentParams: Record<string, string> = {};
//     // @ts-ignore
//     for (let [key, value] of searchParams.entries()) {
//       currentParams[key] = value;
//     }
//     const newParams = callback(currentParams);
//     const newSearchParams = new URLSearchParams(newParams);
//     const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
//     window.history.replaceState(null, '', newUrl);
//     window.dispatchEvent(new Event('aun-query-state-changed'));
//   }, []);
//
//   return { navigateLink, removeLinkParam, replaceLink };
// };






import { useCallback } from 'react';

export const useQueryNavigation = () => {
  const updateUrl = useCallback((newSearchParams: URLSearchParams, eventType: 'pushstate' | 'replacestate' = 'pushstate') => {
    const newUrl = `${window.location.pathname}?${newSearchParams.toString()}`;
    if (eventType === 'pushstate') {
      window.history.pushState(null, '', newUrl);
    } else {
      window.history.replaceState(null, '', newUrl);
    }
    window.dispatchEvent(new Event(eventType));
  }, []);

  const navigateLink = useCallback((params: Record<string, string>) => {
    const currentSearchParams = new URLSearchParams(window.location.search);
    let hasChanged = false;

    // @ts-ignore
    Object.entries(params).forEach(([key, value]) => {
      if (currentSearchParams.get(key) !== value) {
        currentSearchParams.set(key, value);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      updateUrl(currentSearchParams);
    }
  }, [updateUrl]);

  const removeLinkParam = useCallback((params: string[]) => {
    const currentSearchParams = new URLSearchParams(window.location.search);
    let hasChanged = false;

    params.forEach(param => {
      if (currentSearchParams.has(param)) {
        currentSearchParams.delete(param);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      updateUrl(currentSearchParams);
    }
  }, [updateUrl]);

  const replaceLink = useCallback((callback: (params: Record<string, string>) => Record<string, string>) => {
    const currentSearchParams = new URLSearchParams(window.location.search);
    const currentParams: Record<string, string> = {};
    // @ts-ignore
    for (let [key, value] of currentSearchParams.entries()) {
      currentParams[key] = value;
    }

    const newParams = callback(currentParams);
    const newSearchParams = new URLSearchParams(newParams);

    if (newSearchParams.toString() !== currentSearchParams.toString()) {
      updateUrl(newSearchParams, 'replacestate');
    }
  }, [updateUrl]);

  return { navigateLink, removeLinkParam, replaceLink };
};