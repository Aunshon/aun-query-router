# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2024-09-12

### Changed
- Renamed package from `@aunshon/query-router` to `react-query-router`
- Updated all internal references to use the new package name

### Added
- Middleware support for routes
    - Ability to add single or multiple middleware functions to a route
    - Middleware can perform actions before rendering a route
    - Support for `next()` function to continue to next middleware or render
    - Support for `redirect()` function within middleware

### Updated
- `Route` component to accept `middleware` prop
- `Routes` component to handle middleware execution
- README.md with documentation on middleware usage and examples

## [1.0.9] - 2024-09-10

### Added
- Regex support for route matching
    - Routes can now use regular expressions for more flexible path matching
    - Captured groups from regex are passed as params to the route component

### Updated
- Internal route matching logic to support regex-based routes
- Enhanced type definitions for better TypeScript support
- README.md with documentation on regex route matching and examples

## [1.0.4] - 2024-09-09

### Added
- Initial release of aun-query-router
- Basic routing functionality
- Query parameter based navigation
- Support for nested routes

[2.0.0]: https://github.com/Aunshon/aun-query-router/compare/v1.0.9...v2.0.0
[1.0.9]: https://github.com/Aunshon/aun-query-router/compare/v1.0.4...v1.0.9
[1.0.4]: https://github.com/Aunshon/aun-query-router/releases/tag/v1.0.4