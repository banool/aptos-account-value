# Contribution Guide

## Getting Started
Run this from the root:
```
pnpm install
```

## Formatting
We do formatting at the top level. From the root, run this:
```
pnpm fmt
```

## Publishing
Publish the library. First, go into `frontend/` and bump `package.json`. For now we're pre-1.0.0 so anything goes. Then run:
```
pnpm build
pnpm publish
```

There is no need to bump the version of the library used in `api/` and `frontend/` because we use workspace dependencies.

The API and frontend will build + publish automatically in CI.
