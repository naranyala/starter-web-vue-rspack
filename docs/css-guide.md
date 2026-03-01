# CSS Styling Guide

This document provides comprehensive guidance on styling in the application, including the design token system, utility classes, and best practices.

## Table of Contents

- [Design Tokens](#design-tokens)
- [CSS Custom Properties](#css-custom-properties)
- [Utility Classes](#utility-classes)
- [Component Styling](#component-styling)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [CSS Architecture](#css-architecture)
- [Best Practices](#best-practices)

## Design Tokens

Design tokens are the atomic values of the design system, stored as CSS custom properties.

### Color Tokens

#### Primary Palette

The primary color palette is based on Indigo/Violet:

```css
:root {
  --color-primary-50: #eef2ff;
  --color-primary-100: #e0e7ff;
  --color-primary-200: #c7d2fe;
  --color-primary-300: #a5b4fc;
  --color-primary-400: #818cf8;
  --color-primary-500: #6366f1;
  --color-primary-600: #4f46e5;
  --color-primary-700: #4338ca;
  --color-primary-800: #3730a3;
  --color-primary-900: #312e81;
  --color-primary-950: #1e1b4b;
}
```

#### Semantic Colors

Semantic colors convey meaning and state:

```css
/* Success */
--color-success-500: #22c55e;
--color-success-600: #16a34a;
--color-success-700: #15803d;

/* Warning */
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;
--color-warning-700: #b45309;

/* Error */
--color-error-500: #ef4444;
--color-error-600: #dc2626;
--color-error-700: #b91c1c;

/* Info */
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
--color-info-700: #1d4ed8;
```

#### Theme Colors

Theme colors adapt to light and dark modes:

```css
/* Light mode (default) */
:root {
  --color-bg-primary: #ffffff;
  --color-text-primary: #0f172a;
  --color-border-primary: #e2e8f0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f172a;
    --color-text-primary: #f8fafc;
    --color-border-primary: #334155;
  }
}
```

### Typography Tokens

#### Font Families

```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  
  --font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
```

#### Font Sizes (Fluid)

Font sizes use `clamp()` for responsive scaling:

```css
:root {
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
}
```

#### Font Weights

```css
:root {
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Spacing Tokens

Spacing is based on a 4px grid:

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Shadow Tokens

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Border Radius Tokens

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;
}
```

### Transition Tokens

```css
:root {
  --transition-duration: 150ms;
  --transition-duration-slow: 300ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: var(--transition-duration) var(--transition-timing);
  --transition-normal: var(--transition-duration-slow) var(--transition-timing);
}
```

## CSS Custom Properties

### Using Design Tokens

Access design tokens via CSS custom properties:

```css
.button {
  background-color: var(--color-primary-600);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.button:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-md);
}
```

### Overriding Tokens

Override tokens locally for specific contexts:

```css
.dark-section {
  --color-bg-primary: var(--color-secondary-900);
  --color-text-primary: var(--color-secondary-100);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

## Utility Classes

Utility classes provide single-purpose styling for rapid development.

### Layout Utilities

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>

<!-- Container -->
<div class="container mx-auto px-4">
  Content centered with max-width
</div>
```

### Spacing Utilities

```html
<!-- Margin -->
<div class="m-4">Margin all sides</div>
<div class="mx-auto">Horizontal auto margin</div>
<div class="mt-8 mb-4">Top and bottom margin</div>

<!-- Padding -->
<div class="p-6">Padding all sides</div>
<div class="px-4 py-2">Horizontal and vertical padding</div>
```

### Typography Utilities

```html
<h1 class="text-3xl font-bold text-primary">Heading</h1>
<p class="text-base text-secondary leading-relaxed">Paragraph text</p>
<span class="text-sm text-muted">Small muted text</span>
```

### Background Utilities

```html
<div class="bg-primary text-inverse p-4">Primary background</div>
<div class="bg-secondary p-4">Secondary background</div>
<div class="bg-gradient-primary text-white p-4">Gradient background</div>
```

### Border Utilities

```html
<div class="border rounded-lg">Default border</div>
<div class="border-2 border-primary rounded">Thick primary border</div>
<div class="border-t border-b">Top and bottom borders</div>
```

### Shadow Utilities

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-primary">Colored shadow</div>
```

## Component Styling

### Scoped Styles

Use Vue's scoped styles for component-specific styling:

```vue
<template>
  <div class="card">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
}>();
</script>

<style scoped>
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.card-content {
  color: var(--color-text-secondary);
  line-height: var(--leading-relaxed);
}
</style>
```

### CSS Modules

Use CSS modules for locally scoped class names:

```vue
<template>
  <div :class="$styles.container">
    <h3 :class="$styles.title">{{ title }}</h3>
  </div>
</template>

<style module>
.container {
  padding: var(--space-4);
}

.title {
  color: var(--color-text-primary);
}
</style>
```

### Combining Utilities and Custom CSS

```vue
<template>
  <div class="card p-6 rounded-xl shadow">
    <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
    <p class="text-secondary leading-relaxed">{{ content }}</p>
  </div>
</template>

<style scoped>
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  transition: var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
</style>
```

## Responsive Design

### Breakpoints

```css
/* Small devices */
@media (min-width: 640px) { }

/* Medium devices */
@media (min-width: 768px) { }

/* Large devices */
@media (min-width: 1024px) { }

/* Extra large devices */
@media (min-width: 1280px) { }

/* 2XL devices */
@media (min-width: 1536px) { }
```

### Responsive Utility Classes

```html
<!-- Display -->
<div class="hidden md:block lg:flex">Responsive display</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>

<!-- Spacing -->
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>

<!-- Typography -->
<h1 class="text-xl md:text-2xl lg:text-3xl">Responsive heading</h1>
```

### Mobile-First Approach

Write base styles for mobile, then enhance for larger screens:

```css
.card {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .card {
    padding: var(--space-8);
  }
}
```

## Dark Mode

### Automatic Dark Mode

Dark mode is automatically enabled based on system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-secondary-900);
    --color-text-primary: var(--color-secondary-50);
    --color-border-primary: var(--color-secondary-700);
  }
}
```

### Manual Dark Mode Toggle

Add a class-based dark mode toggle:

```css
.dark {
  --color-bg-primary: var(--color-secondary-900);
  --color-text-primary: var(--color-secondary-50);
  --color-border-primary: var(--color-secondary-700);
}
```

```typescript
// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}
```

### Dark Mode in Components

```vue
<style scoped>
.card {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
</style>
```

## CSS Architecture

### File Organization

```
src/styles/
├── reset.css         # CSS reset
├── theme.css         # Design tokens
├── utilities.css     # Utility classes
└── index.css         # Entry point
```

### Import Order

```css
/* 1. Reset - Normalize browser defaults */
@import './reset.css';

/* 2. Theme - Design tokens */
@import './theme.css';

/* 3. Utilities - Utility classes */
@import './utilities.css';
```

### Specificity Guidelines

1. Use single classes when possible
2. Avoid ID selectors
3. Minimize nesting depth
4. Use scoped styles in components
5. Prefer utility classes over custom CSS

## Best Practices

### Naming Conventions

- Use descriptive, semantic class names
- Follow kebab-case for class names
- Prefix component classes with component name
- Use BEM-like patterns for complex components

```css
/* Good */
.user-card { }
.user-card__header { }
.user-card__avatar { }
.user-card--active { }

/* Avoid */
.uc { }
.cardHeader { }
.userCardActive { }
```

### Performance

1. Use CSS custom properties for theming
2. Minimize CSS in JavaScript
3. Use `will-change` sparingly
4. Avoid universal selectors
5. Use `contain` for isolated components

```css
.expensive-component {
  contain: layout style paint;
}
```

### Accessibility

1. Ensure sufficient color contrast
2. Provide focus styles
3. Support reduced motion
4. Use semantic HTML
5. Test with screen readers

```css
/* Focus styles */
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Maintainability

1. Keep CSS files small and focused
2. Document complex styles
3. Use design tokens consistently
4. Remove unused styles
5. Follow established patterns

## Related Documentation

- [Architecture Overview](./architecture.md)
- [TypeScript Guide](./typescript-guide.md)
- [Component Guide](./components.md)
