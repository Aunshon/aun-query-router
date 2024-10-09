export const RouterLocation = () => {
  return {
    getAllParams: (): {
      currentParams: Record<string, string>;
      searchString: string;
      searchParams: URLSearchParams;
    } => {
      const searchString = window.location.search;
      const searchParams = new URLSearchParams(searchString);
      const currentParams: Record<string, string> = {};

      searchParams.forEach((value, key) => {
        currentParams[key] = value;
      });


      return { currentParams, searchString, searchParams };
    }
  }
}