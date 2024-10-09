import { useCallback } from 'react';
import { RouterLocation } from "../utils/RouterLocation";

export const useQueryNavigation = () => {
  const { getAllParams } = RouterLocation();

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
    const { searchParams } = getAllParams();
    let hasChanged = false;

    // @ts-ignore
    Object.entries(params).forEach(([key, value]) => {
      if (searchParams.get(key) !== value) {
        searchParams.set(key, value);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      updateUrl(searchParams);
    }
  }, [updateUrl]);

  const removeLinkParam = useCallback((params: string[]) => {
    const { searchParams } = getAllParams();
    let hasChanged = false;

    params.forEach(param => {
      if (searchParams.has(param)) {
        searchParams.delete(param);
        hasChanged = true;
      }
    });

    if (hasChanged) {
      updateUrl(searchParams);
    }
  }, [updateUrl]);

  const replaceLink = useCallback( (callback: (params: Record<string, string>) => Record<string, string>) => {
    const { currentParams, searchParams } = getAllParams();

    const newParams = callback(currentParams);
    const newSearchParams = new URLSearchParams(newParams);

    if (newSearchParams.toString() !== searchParams.toString()) {
      updateUrl(newSearchParams, 'replacestate');
    }


  }, [updateUrl]);

  return { navigateLink, removeLinkParam, replaceLink };
};