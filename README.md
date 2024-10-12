# react-query-router

A query-based router for WordPress pages or any React application.

## Installation

```bash
npm install react-query-router
```

## Usage

```jsx
import { Routes, Route, QueryLink } from "react-query-router";

const About = () => <div><h3>About Page</h3></div>;
const Contact = () => <div><h3>Contact Page</h3></div>;
const Home = () => <div><h3>Home Page</h3></div>;
const AboutDetail = (props) => {
  console.log(props);
  
  return <div><h3>About Detail</h3></div>;
};
const NumberComponent = (props) => {
  console.log(props);

  return <div><h3>Number component</h3></div>;
};
const NoRouteFound = () => <div><h3>404 not found</h3></div>;

const Navigation = () => (
  <nav>
    <ul>
      <li><QueryLink param="path" to="">Home</QueryLink></li>
      <li><QueryLink param="path" to="about">About</QueryLink></li>
      <li><QueryLink param="path" to="about/23">About/23</QueryLink></li>
      <li><QueryLink param="path" to="contact">Contact</QueryLink></li>
      <li><QueryLink param="path" to="45">45 (any number)</QueryLink></li>
      <li><QueryLink param="path" to="nomathc" >No match found param</QueryLink></li>
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
        <Route param="^about/(?<id>\d+)$" regex element={<AboutDetail />} />
        <Route param="^(?<id>\d+)$" regex element={<NumberComponent />} />
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
import { useQueryNavigation } from 'react-query-router';

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
import { RouterLocation } from 'react-query-router';

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
import { useWatchParam } from 'react-query-router';

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
## Route Regex Support

This routing supports regex-based routing, allowing for more flexible and powerful route matching. This feature enables you to create routes that match complex patterns and extract parameters from the URL.

### Using Regex Routes

To use a regex-based route, add the `regex` prop to your `Route` component and provide a regular expression as the `param` value.

```jsx
<Route param="^about/(?<id>\d+)$" regex element={<AboutDetail />} />
```

In this example:
- `^` asserts the start of the string
- `about/` matches the literal string "about/"
- `(?<id>\d+)` is a named capture group that matches one or more digits
- `$` asserts the end of the string

This route will match paths like "/about/123" or "/about/456789", but not "/about/abc".

### Accessing Captured Parameters

When a regex route matches, any named capture groups in the regex are passed to the component as props. You can access these in your component like this:

```jsx
const AboutDetail = ({ params }) => {
  return <div>About Detail for ID: {params.id}</div>;
};
```

### Example: Numbers-Only Route

Here's an example of a route that only accepts numeric paths:

```jsx
<Route param="^(?<id>\d+)$" regex element={<NumberComponent />} />

const NumberComponent = ({ params }) => {
  return <div>Numeric Route: {params.id}</div>;
};
```

This route will:
- Match: "/123", "/456789"
- Not match: "/abc", "/123abc", "/"

### Tips for Using Regex Routes

1. Always use the `^` and `$` anchors to match the entire path.
2. Use named capture groups `(?<name>...)` to extract parameters.
3. Be careful with greedy quantifiers (`*`, `+`) as they might match more than intended.
4. Test your regex thoroughly to ensure it matches and captures as expected.

### Performance Considerations

While regex routes offer great flexibility, they can be slower than simple string matching for very high traffic applications. Use them judiciously, especially if you have a large number of routes.

### Middleware Support

react-query-router now supports middleware functions for routes. Middleware allows you to run code before a route is rendered, enabling features like authentication checks, logging, or data prefetching.

#### Middleware Function Signature

```typescript
type MiddlewareFunction = (
  params: Record<string, string>,
  next: () => React.ReactNode | null,
  redirect: (to: string) => void
) => React.ReactNode | void;
```

- `params`: An object containing the route parameters
- `next()`: A function to call the next middleware or render the route component
- `redirect(to)`: A function to redirect to another route

#### Middleware Function Example

```jsx
const authMiddleware = (params, next, redirect) => {
  // Perform some checks or actions
  if (someCondition) {
    return next(); // Proceed to the route
  } else {
    return redirect('login'); // Redirect to another route
  }
};
```

#### Using Middleware

You can add middleware to a route by using the `middleware` prop:

```jsx
<Route 
  param="about" 
  element={<About />} 
  middleware={authMiddleware} 
/>
```

You can also use an array of middleware functions:

```jsx
<Route 
  param="dashboard" 
  element={<Dashboard />} 
  middleware={[logMiddleware, authMiddleware]} 
/>
```

Middleware functions are executed in the order they are provided.

## License

MIT
