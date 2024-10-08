# aun-query-router

A query-based router for WordPress pages or any react application.

## Installation

```bash
npm install aun-query-router
```

## Usage
```jsx
import { Routes, Route, Link, useWatchParam } from 'aun-query-router';

function App() {
  const query = useWatchParam(['path']);
  const path = query['path'];

  return (
    <div>
      <nav>
        <Link param="path" to="">Home</Link>
        <Link param="path" to="about">About</Link>
        <Link param="path" to="contact">Contact</Link>
      </nav>
      <Routes paramWatcher="path">
        <Route index element={<Home />} />
        <Route param="about" element={<About />} />
        <Route param="contact" element={<Contact />} />
      </Routes>
    </div>
  );
}
```

## API
...

## License
MIT