# Vue 3 + Rspack Starter

A modern Vue 3 single-page application boilerplate powered by [Rspack](https://rspack.dev/) - a fast Rust-based bundler.

## Features

- ⚡ **Fast Builds** - Powered by Rspack (Rust-based, 10x faster than Webpack)
- 🎨 **Vue 3 SFC** - Full support for Vue 3 Single-File Components
- 📘 **TypeScript** - First-class TypeScript support
- 🎯 **Pinia** - Official Vue state management
- 🔧 **Biome** - Fast linter and formatter (Rust-based)
- 🧪 **Bun Test** - Fast test runner
- 📦 **ESM** - Native ES Modules configuration

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3.5+ |
| Bundler | Rspack 1.7+ |
| Language | TypeScript 5.7+ |
| State Management | Pinia 2.3+ |
| Linting | Biome 2.3+ |
| Testing | Bun Test |
| Runtime | Bun / Node.js |

## Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git

## Getting Started

### Install dependencies

```bash
bun install
```

### Development

```bash
# Start dev server with HMR
bun run dev
```

The dev server runs at `http://localhost:3000/`

### Build

```bash
# Production build
bun run build

# Incremental build (faster, for testing)
bun run build:incremental
```

### Code Quality

```bash
# Lint
bun run lint
bun run lint:fix

# Format
bun run format
bun run format:fix

# Check (lint + format)
bun run check
bun run check:fix

# Type check
bun run type-check
```

### Testing

```bash
# Run tests
bun test

# Watch mode
bun test:watch
```

### Clean

```bash
# Remove build artifacts and cache
bun run clean
```

## Project Structure

```
├── src/
│   ├── components/       # Vue components
│   ├── composables/      # Composable functions
│   ├── core/             # Core utilities
│   ├── models/           # Domain models and services
│   ├── plugins/          # Vue plugins
│   ├── services/         # Application services
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript types
│   ├── views/            # Page views
│   ├── viewmodels/       # View models
│   ├── use-cases/        # Business logic use cases
│   ├── lib/              # Shared libraries
│   ├── __tests__/        # Test files
│   └── main.ts           # Application entry point
├── index.html            # HTML template
├── rspack.config.mjs     # Base Rspack config
├── rspack.config.dev.mjs # Development config
├── rspack.config.prod.mjs# Production config
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies and scripts
└── biome.json            # Biome config
```

## Configuration

### Rspack

The project uses three configuration files:

- `rspack.config.mjs` - Base configuration with Vue loader setup
- `rspack.config.dev.mjs` - Development-specific settings (HMR, source maps)
- `rspack.config.prod.mjs` - Production optimizations (minification, code splitting)

### TypeScript

TypeScript is configured for Vue 3 SFC support with path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Usage:
```typescript
import App from '@/views/pages/App.vue';
```

### Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@/` | `src/` |

## Vue 3 Integration

This project uses the official `rspack-vue-loader` for Vue 3 SFC support.

### Configuration

```javascript
import { VueLoaderPlugin } from 'rspack-vue-loader';

export default {
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'rspack-vue-loader',
        options: {
          experimentalInlineMatchResource: true,
        },
      },
    ],
  },
};
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Production build |
| `build:incremental` | Faster incremental build |
| `preview` | Preview production build |
| `lint` | Run Biome linter |
| `format` | Run Biome formatter |
| `check` | Run Biome check (lint + format) |
| `test` | Run Bun tests |
| `type-check` | Run TypeScript type check |
| `clean` | Clean build artifacts |

## Browser Support

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## License

MIT
