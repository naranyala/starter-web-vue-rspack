# Documentation Index

Welcome to the Vue 3 + Rspack Starter documentation. This index provides an overview of all available documentation.

## Getting Started

| Document | Description |
|----------|-------------|
| [README](../README.md) | Project overview, quick start, and available scripts |
| [Architecture](./architecture.md) | Application architecture and design patterns |

## Core Guides

| Document | Description |
|----------|-------------|
| [TypeScript Guide](./typescript-guide.md) | TypeScript configuration, types, and best practices |
| [CSS Guide](./css-guide.md) | Design tokens, utility classes, and styling patterns |
| [Components Guide](./components.md) | Component development patterns and conventions |
| [Deployment Guide](./deployment.md) | Building and deploying to various platforms |

## Quick Reference

### Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Production build
bun run build:incremental # Faster incremental build

# Code Quality
bun run lint             # Run linter
bun run format           # Run formatter
bun run check            # Run all checks
bun run type-check       # TypeScript type check

# Testing
bun test                 # Run tests
bun run test:watch       # Watch mode
bun run ci               # CI checks

# Maintenance
bun run clean            # Clean build artifacts
```

### Directory Structure

```
src/
├── components/    # Reusable Vue components
├── composables/   # Composable functions
├── core/          # Core utilities
├── models/        # Domain models
├── plugins/       # Vue plugins
├── services/      # Application services
├── stores/        # Pinia stores
├── styles/        # Global CSS
├── types/         # TypeScript types
├── views/         # Page views
├── viewmodels/    # View models
├── use-cases/     # Business logic
├── lib/           # Shared libraries
└── main.ts        # Entry point
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `rspack.config.mjs` | Base Rspack configuration |
| `rspack.config.dev.mjs` | Development configuration |
| `rspack.config.prod.mjs` | Production configuration |
| `tsconfig.json` | TypeScript configuration |
| `biome.json` | Biome linter/formatter config |
| `package.json` | Dependencies and scripts |

## Design Tokens

### Colors

```css
/* Primary */
--color-primary-500: #6366f1;
--color-primary-600: #4f46e5;

/* Semantic */
--color-success-500: #22c55e;
--color-warning-500: #f59e0b;
--color-error-500: #ef4444;
--color-info-500: #3b82f6;
```

### Spacing

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
```

### Typography

```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
```

## Common Patterns

### Component Template

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title: string;
  count?: number;
}

interface Emits {
  (e: 'click'): void;
  (e: 'update', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<Emits>();
const localState = ref('');
</script>

<template>
  <div class="component">
    <h3>{{ title }}</h3>
    <button @click="emit('click')">Click</button>
  </div>
</template>

<style scoped>
.component {
  padding: var(--space-4);
}
</style>
```

### Composable Pattern

```typescript
import { ref, computed } from 'vue';

export function useExample(initialValue = '') {
  const value = ref(initialValue);
  
  const isValid = computed(() => value.value.length > 0);
  
  function update(newValue: string) {
    value.value = newValue;
  }
  
  function reset() {
    value.value = initialValue;
  }
  
  return {
    value,
    isValid,
    update,
    reset,
  };
}
```

### Store Pattern

```typescript
import { defineStore } from 'pinia';

interface State {
  items: Item[];
  loading: boolean;
}

export const useExampleStore = defineStore('example', {
  state: (): State => ({
    items: [],
    loading: false,
  }),
  
  getters: {
    itemCount: (state) => state.items.length,
  },
  
  actions: {
    async fetch() {
      this.loading = true;
      // Fetch logic
      this.loading = false;
    },
  },
});
```

## External Resources

### Vue 3

- [Vue 3 Documentation](https://vuejs.org/)
- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)

### Rspack

- [Rspack Documentation](https://rspack.dev/)
- [Rspack Configuration](https://rspack.dev/config/)
- [rspack-vue-loader](https://www.npmjs.com/package/rspack-vue-loader)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Utilities](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### CSS

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)

## Support

For questions or issues:

1. Check the documentation
2. Review existing issues
3. Create a new issue with details

## Contributing

See the main README.md for contribution guidelines.
