# Vue 3 + Rspack Starter

A modern Vue 3 single-page application boilerplate powered by Rspack - a fast Rust-based bundler.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Vue 3 Integration](#vue-3-integration)
- [CSS & Styling](#css--styling)
- [TypeScript](#typescript)
- [State Management](#state-management)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Fast Builds - Powered by Rspack (Rust-based, 10x faster than Webpack)
- Vue 3 SFC - Full support for Vue 3 Single-File Components with TypeScript
- Modern CSS - Comprehensive design token system with CSS custom properties
- Dark Mode - Automatic dark mode support via CSS media queries
- TypeScript - First-class TypeScript support with path aliases
- Pinia - Official Vue state management library
- Biome - Fast linter and formatter (Rust-based)
- Bun Test - Fast test runner
- ESM - Native ES Modules configuration
- Responsive Design - Mobile-first utility classes and breakpoints

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Vue 3.5+ |
| Bundler | Rspack 1.7+ |
| Language | TypeScript 5.7+ |
| State Management | Pinia 2.3+ |
| CSS | Modern CSS with Custom Properties |
| Linting | Biome 2.3+ |
| Testing | Bun Test |
| Runtime | Bun / Node.js 18+ |

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) (recommended) version 1.0 or higher
- Git version 2.0 or higher

Optional:
- Node.js 18+ (if not using Bun)

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd starter-web-vue-rspack
```

### Install Dependencies

```bash
bun install
```

### Start Development Server

```bash
bun run dev
```

The development server will start at `http://localhost:3000/` with Hot Module Replacement (HMR) enabled.

## Available Scripts

### Development

```bash
# Start development server with HMR
bun run dev
```

### Building

```bash
# Production build with optimizations
bun run build

# Incremental build (faster, for testing)
bun run build:incremental

# Preview production build
bun run preview
```

### Code Quality

```bash
# Run Biome linter
bun run lint

# Fix linting issues
bun run lint:fix

# Run Biome formatter
bun run format

# Format files
bun run format:fix

# Run all checks (lint + format)
bun run check

# Fix all issues
bun run check:fix

# TypeScript type check
bun run type-check
```

### Testing

```bash
# Run all tests
bun test

# Watch mode for development
bun run test:watch

# Run CI checks (lint + test)
bun run ci
```

### Maintenance

```bash
# Clean build artifacts and cache
bun run clean
```

## Project Structure

```
starter-web-vue-rspack/
├── docs/                     # Documentation
│   ├── architecture.md       # Architecture overview
│   ├── css-guide.md          # CSS styling guide
│   ├── typescript-guide.md   # TypeScript guide
│   └── deployment.md         # Deployment guide
├── src/
│   ├── components/           # Vue components
│   │   ├── AppSidebar.vue
│   │   ├── DevTools.vue
│   │   ├── ErrorBoundary.vue
│   │   └── FeatureCard.vue
│   ├── composables/          # Composable functions (hooks)
│   │   ├── useWindowContent.ts
│   │   └── useWindowManager.ts
│   ├── core/                 # Core utilities
│   │   └── errorTracker.ts
│   ├── models/               # Domain models and services
│   │   ├── services/
│   │   ├── stores/
│   │   └── composables/
│   ├── plugins/              # Vue plugins
│   ├── services/             # Application services
│   │   ├── logger.js
│   │   └── webui.ts
│   ├── stores/               # Pinia stores
│   │   ├── userStore.ts
│   │   └── systemStore.ts
│   ├── styles/               # Global styles
│   │   ├── reset.css         # CSS reset
│   │   ├── theme.css         # Design tokens
│   │   ├── utilities.css     # Utility classes
│   │   └── index.css         # Entry point
│   ├── types/                # TypeScript type definitions
│   ├── views/                # Page views
│   │   ├── pages/
│   │   └── features/
│   ├── viewmodels/           # View models
│   ├── use-cases/            # Business logic use cases
│   ├── lib/                  # Shared libraries
│   ├── __tests__/            # Test files
│   ├── main.ts               # Application entry point
│   └── vite-env.d.ts         # Type declarations
├── index.html                # HTML template
├── rspack.config.mjs         # Base Rspack configuration
├── rspack.config.dev.mjs     # Development configuration
├── rspack.config.prod.mjs    # Production configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript config for Node files
├── package.json              # Dependencies and scripts
├── biome.json                # Biome configuration
├── .gitignore                # Git ignore rules
├── .editorconfig             # Editor configuration
└── README.md                 # This file
```

## Configuration

### Rspack Configuration

The project uses three configuration files for different environments:

#### Base Configuration (rspack.config.mjs)

Contains the core configuration shared across all environments:

- Vue loader setup with `rspack-vue-loader`
- TypeScript compilation with SWC
- CSS handling
- Path aliases
- HTML plugin configuration

#### Development Configuration (rspack.config.dev.mjs)

Extends base config with development-specific settings:

- Source maps for debugging
- Memory cache for faster rebuilds
- Disabled code splitting for faster builds
- Public path set to `/`

#### Production Configuration (rspack.config.prod.mjs)

Extends base config with production optimizations:

- Code minification
- Code splitting and chunk optimization
- Tree shaking
- Performance hints

### Path Aliases

TypeScript is configured with path aliases for cleaner imports:

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

Usage example:

```typescript
import App from '@/views/pages/App.vue';
import { logger } from '@/services';
```

## Vue 3 Integration

This project uses the official `rspack-vue-loader` for Vue 3 Single-File Component support.

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

### Vue 3 Script Setup

All components use the `<script setup>` syntax for cleaner code:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">{{ doubled }}</button>
</template>
```

## CSS & Styling

### Design Tokens

The project includes a comprehensive design token system in `src/styles/theme.css`:

#### Colors

- Primary palette (Indigo/Violet)
- Secondary palette (Slate)
- Semantic colors (Success, Warning, Error, Info)
- Automatic dark mode support

#### Typography

- Fluid font sizes using `clamp()`
- Multiple font families (sans, serif, mono)
- Font weights and line heights

#### Spacing

- 4px grid-based scale
- Container widths for responsive layouts

#### Effects

- Shadow variants
- Border radius scale
- Transition timing functions
- Backdrop filters
- Gradients

### Utility Classes

Use utility classes from `src/styles/utilities.css` for rapid development:

```vue
<template>
  <div class="flex items-center gap-4 p-6 bg-secondary rounded-lg shadow">
    <h2 class="text-xl font-semibold text-primary">Title</h2>
    <button class="px-4 py-2 bg-primary text-inverse rounded hover:opacity-90">
      Action
    </button>
  </div>
</template>
```

### CSS Custom Properties

Access design tokens via CSS custom properties:

```css
.button {
  background-color: var(--color-primary-600);
  color: var(--color-text-inverse);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-primary);
  transition: var(--transition-fast);
}
```

### Dark Mode

Dark mode is automatically enabled based on system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-secondary-900);
    --color-text-primary: var(--color-secondary-50);
  }
}
```

## TypeScript

### Configuration

TypeScript is configured in `tsconfig.json` with:

- ES2020 target
- Bundler module resolution
- Strict type checking
- Vue 3 SFC support
- Path aliases

### Type Declarations

Global type declarations are in `src/vite-env.d.ts`:

- Vue component types
- Environment variables
- WebUI bridge types
- Custom event types

### Best Practices

1. Always use TypeScript for new files
2. Define interfaces for component props
3. Use typed composables
4. Leverage type inference where possible

## State Management

### Pinia Stores

State management is handled by Pinia stores:

```typescript
// src/stores/userStore.ts
import { defineStore } from 'pinia';

interface UserState {
  users: User[];
  loading: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    loading: false,
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      // Fetch logic
    },
  },
});
```

### Usage in Components

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
await userStore.fetchUsers();
</script>
```

## Code Quality

### Biome Configuration

Biome is configured in `biome.json` for:

- Linting
- Formatting
- Code organization

### Editor Integration

Install the Biome extension for your editor:

- VS Code: `biomejs.biome`
- WebStorm: Built-in support

### Pre-commit Hooks

Consider adding Husky for pre-commit checks:

```bash
bun add -d husky
bunx husky install
```

## Testing

### Bun Test

Tests are written using Bun's built-in test runner:

```typescript
// src/__tests__/example.test.ts
import { describe, it, expect } from 'bun:test';

describe('Example', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun run test:watch

# Run specific test file
bun test src/__tests__/example.test.ts
```

## Building for Production

### Production Build

```bash
bun run build
```

This creates an optimized build in the `dist/` directory with:

- Minified JavaScript and CSS
- Code splitting
- Tree shaking
- Asset optimization
- Source maps (optional)

### Build Output

```
dist/
├── index.html
├── js/
│   ├── index.[hash].js
│   └── vendors.[hash].js
└── css/
    └── index.[hash].css
```

### Deployment

Copy the contents of `dist/` to your web server or hosting platform.

## Browser Support

The application supports the following browsers:

| Browser | Version |
|---------|---------|
| Chrome | 87+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 88+ |

### Polyfills

Modern browsers are assumed. For older browser support, add polyfills as needed.

## Troubleshooting

### Common Issues

#### Module Not Found

Ensure the file extension is included in `resolve.extensions` in your Rspack config.

#### TypeScript Errors

Run `bun run type-check` to identify type errors.

#### CSS Not Loading

Verify the import in `main.ts` and check that `.css` is in `resolve.extensions`.

#### Build Fails

Clear the cache and rebuild:

```bash
bun run clean
bun run build
```

### Getting Help

1. Check the documentation in `docs/`
2. Review existing issues
3. Create a new issue with details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and checks
5. Submit a pull request

## License

MIT License - See LICENSE file for details.
