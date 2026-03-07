# Contributing

Thanks for contributing to `csfloat-node-sdk`.

## Principles

1. keep the repository honest about coverage and validation status
2. prefer official docs and live-validated behavior over assumptions
3. do not merge undocumented claims as if they were confirmed API surface

## Development

```bash
npm install
npm test
npm run check
npm run build
```

## Contribution Guidelines

1. keep changes focused
2. update docs when API behavior changes
3. clearly mark undocumented but source-discovered behavior
4. do not hardcode secrets in code, tests, or examples
5. keep mutation examples opt-in and clearly labeled

## Pull Requests

Good pull requests should include:

1. a clear summary of what changed
2. validation notes
3. docs updates when the public surface changed
4. tests when practical
