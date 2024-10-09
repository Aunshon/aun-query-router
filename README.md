# @aunshon/query-router

A query-based router for WordPress pages or any React application.

## Installation

```bash
npm install @aunshon/query-router
```

## Usage

```jsx
import { Routes, Route, QueryLink } from '@aunshon/query-router';

const About = () => <div><h3>About Page</h3></div>;
const Contact = () => <div><h3>Contact Page</h3></div>;
const Home = () => <div><h3>Home Page</h3></div>;
const NoRouteFound = () => <div><h3>404 not found</h3></div>;

const Navigation = () => (
  <nav>
    <ul>
      <li><QueryLink param="path" to="">Home</QueryLink></li>
      <li><QueryLink param="path" to="about">About</QueryLink></li>
      <li><QueryLink param="path" to="contact">Contact</QueryLink></li>
      <li><QueryLink param="path" to={new Date().getTime()}>Any no match path</QueryLink></li>
    </ul>
  </nav>
);

function App() {
  return (
    <div>
      <Navigation />
      <Routes paramWatcher="path">
        <Route index element={<Home />} />
        <Route param="about" element={<About />} />
        <Route param="contact" element={<Contact />} />
        <Route param="*" element={<NoRouteFound />} />
      </Routes>
    </div>
  );
}

export default App;
```

## API

### useQueryNavigation

The `useQueryNavigation` hook provides methods for manipulating the URL query parameters.

```jsx
import { useQueryNavigation } from '@aunshon/query-router';

function MyComponent() {
  const { navigateLink, removeLinkParam, replaceLink } = useQueryNavigation();

  // Usage examples...
}
```

#### navigateLink

Adds or updates query parameters in the URL.

```jsx
navigateLink({ user: '1', page: '2' });
// Updates URL to: ?user=1&page=2
```

#### removeLinkParam

Removes specified query parameters from the URL.

```jsx
removeLinkParam(['user', 'page']);
// Removes 'user' and 'page' parameters from the URL
```

#### replaceLink

Replaces all query parameters in the URL based on a callback function.

```jsx
replaceLink((currentParams) => ({
  ...currentParams,
  newParam: 'value',
  updatedParam: 'newValue'
}));
// Replaces or adds 'newParam' and 'updatedParam' while keeping other existing parameters
```

#### getAllParams

Returns all parameters, query string and `URLSearchParams` instance in the URL.

```jsx
import { RouterLocation } from '@aunshon/query-router';

function MyComponent() {
  const { getAllParams } = RouterLocation();
  const { currentParams, searchParams, searchString } = getAllParams();

  console.log('Current params:', currentParams);
  console.log('Search string:', searchString);
  console.log('Search params, URLSearchParams :', searchParams);

  // Rest of the component...
}
```

### useWatchParam

The `useWatchParam` hook allows you to watch for changes in specific query parameters.

```jsx
import { useWatchParam } from '@aunshon/query-router';

function MyComponent() {
  const params = useWatchParam(['user', 'page']);

  useEffect(() => {
    console.log('User changed:', params.user);
    console.log('Page changed:', params.page);
  }, [params]);

  // Rest of the component...
}
```

## Components

### QueryLink

Creates a link that updates query parameters when clicked.

```jsx
<QueryLink param="path" to="about">About</QueryLink>
```

### Routes

Wrapper component for defining routes based on query parameters.

```jsx
<Routes paramWatcher="path">
  {/* Route components go here */}
</Routes>
```

### Route

Defines a single route within the Routes component.

```jsx
<Route param="about" element={<About />} />
```

## License

MIT