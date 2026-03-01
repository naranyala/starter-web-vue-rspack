# TypeScript Guide

This document provides comprehensive guidance on using TypeScript in the application, including configuration, best practices, and patterns.

## Table of Contents

- [Configuration](#configuration)
- [Type Declarations](#type-declarations)
- [Vue Components](#vue-components)
- [Composables](#composables)
- [Pinia Stores](#pinia-stores)
- [API Types](#api-types)
- [Generic Types](#generic-types)
- [Utility Types](#utility-types)
- [Best Practices](#best-practices)

## Configuration

### tsconfig.json

The TypeScript configuration is optimized for Vue 3 with Rspack:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

### Key Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `target` | ES2020 | Modern JavaScript features |
| `module` | ESNext | ES module syntax |
| `moduleResolution` | bundler | Optimized for bundlers |
| `strict` | true | Full type checking |
| `jsx` | preserve | Let Vue handle JSX |
| `paths` | @/* | Path aliases |

## Type Declarations

### Global Types

Global type declarations are in `src/vite-env.d.ts`:

```typescript
// Vue component types
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

// Environment variables
interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// WebUI bridge for backend integration
interface Window {
  __webui__?: {
    call: (action: string, data: string) => Promise<string>;
    bind: (event: string, callback: (response: string) => void) => void;
  };
  WinBox: any;
}
```

### Custom Type Definitions

Create type definitions in `src/types/`:

```typescript
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: string;
  lastLogin?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku?: string;
  weight?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Vue Components

### Component Props

Define props with TypeScript:

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  disabled?: boolean;
  items: Array<{
    id: number;
    label: string;
  }>;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false,
});
</script>
```

### Component Emits

Define emits with TypeScript:

```vue
<script setup lang="ts">
interface Emits {
  (e: 'click', event: MouseEvent): void;
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();
</script>
```

### Component Slots

Define slots with TypeScript:

```vue
<script setup lang="ts">
interface Slots {
  header: { title: string };
  default: { items: unknown[] };
  footer: Record<string, never>;
}

const slots = defineSlots<Slots>();
</script>
```

### Template Refs

Type template references:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" type="text" />
  <ul ref="listRef">
    <li>Item</li>
  </ul>
</template>
```

### Component Instance Types

```typescript
import type { ComponentPublicInstance } from 'vue';

interface ChildComponent {
  focus: () => void;
  validate: () => boolean;
}

const childRef = ref<ComponentPublicInstance<ChildComponent> | null>(null);
```

## Composables

### Basic Composable

```typescript
// src/composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  
  const doubled = computed(() => count.value * 2);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  function reset() {
    count.value = initialValue;
  }
  
  return {
    count,
    doubled,
    increment,
    decrement,
    reset,
  };
}
```

### Composable with Generic Types

```typescript
// src/composables/useFetch.ts
import { ref, type Ref } from 'vue';

interface UseFetchOptions {
  immediate?: boolean;
  onError?: (error: Error) => void;
}

export function useFetch<T>(
  url: string,
  options: UseFetchOptions = {}
) {
  const { immediate = true, onError } = options;
  
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(false);
  
  async function execute() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);
      data.value = await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      onError?.(error.value);
    } finally {
      loading.value = false;
    }
  }
  
  if (immediate) {
    execute();
  }
  
  return {
    data,
    error,
    loading,
    execute,
  };
}
```

### Composable Return Types

Define explicit return types for complex composables:

```typescript
interface UseAuthReturn {
  user: Ref<User | null>;
  isAuthenticated: ComputedRef<boolean>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  // Implementation
}
```

## Pinia Stores

### Store State Types

```typescript
// src/stores/userStore.ts
import { defineStore } from 'pinia';
import type { User } from '@/types';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  }),
  
  getters: {
    activeUsers: (state): User[] => {
      return state.users.filter(user => user.status === 'active');
    },
    
    getUserById: (state) => {
      return (id: number): User | undefined => {
        return state.users.find(user => user.id === id);
      };
    },
  },
  
  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        // Fetch logic
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Unknown error';
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### Store Type Helpers

```typescript
// Infer store types
type UserStore = ReturnType<typeof useUserStore>;
type UserState = UserStore['$state'];
```

## API Types

### Request/Response Types

```typescript
// src/types/api.ts
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequest {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### API Service Types

```typescript
// src/services/apiClient.ts
import type { ApiRequest, ApiResponse } from '@/types/api';

interface ApiClient {
  request<T>(config: ApiRequest): Promise<ApiResponse<T>>;
  get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>>;
  post<T>(url: string, data: unknown): Promise<ApiResponse<T>>;
  put<T>(url: string, data: unknown): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}
```

## Generic Types

### Generic Interfaces

```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}
```

### Generic Functions

```typescript
function mapArray<T, U>(
  array: T[],
  mapper: (item: T, index: number) => U
): U[] {
  return array.map(mapper);
}

function filterBy<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T,
  value: unknown
): T[] {
  return items.filter(item => item[key] === value);
}
```

### Generic Components

```vue
<script setup lang="ts" generic="T extends { id: number }">
interface Props {
  items: T[];
  renderItem: (item: T) => string;
}

defineProps<Props>();
</script>
```

## Utility Types

### Built-in Utility Types

```typescript
// Partial - Make all properties optional
type PartialUser = Partial<User>;

// Required - Make all properties required
type RequiredUser = Required<User>;

// Pick - Select specific properties
type UserPreview = Pick<User, 'id' | 'name' | 'email'>;

// Omit - Exclude specific properties
type UserWithoutId = Omit<User, 'id'>;

// Record - Create object type with specific keys
type UserMap = Record<number, User>;

// ReturnType - Infer return type
type CounterReturn = ReturnType<typeof useCounter>;

// Parameters - Infer parameter types
type FetchParams = Parameters<typeof fetch>;
```

### Custom Utility Types

```typescript
// Make specific properties readonly
type ReadonlyUser = Readonly<Pick<User, 'id' | 'email'>>;

// Make specific properties mutable
type MutableUser = Mutable<Pick<User, 'status'>>;

// Deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Non-nullable
type NonNullableUser = NonNullable<User | null>;
```

## Best Practices

### Type Safety

1. Enable strict mode in tsconfig
2. Avoid `any` - use `unknown` instead
3. Define explicit return types for functions
4. Use type guards for runtime checks
5. Prefer interfaces for object shapes

```typescript
// Avoid
function process(data: any) { }

// Prefer
function process(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // Type guard
  }
}
```

### Type Guards

```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'email' in data
  );
}

function assertIsUser(data: unknown): asserts data is User {
  if (!isUser(data)) {
    throw new Error('Not a user');
  }
}
```

### Discriminated Unions

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: string };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function render(state: AsyncState<User>) {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserCard user={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
}
```

### Module Augmentation

```typescript
// Augment Vue types
declare module 'vue' {
  interface ComponentCustomProperties {
    $logger: Logger;
  }
}

// Augment Window
declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}
```

### Performance

1. Use `type` for simple aliases
2. Use `interface` for object shapes
3. Avoid deeply nested types
4. Use `const` for literal types
5. Lazy load type-heavy modules

## Related Documentation

- [Architecture Overview](./architecture.md)
- [CSS Guide](./css-guide.md)
- [Deployment Guide](./deployment.md)
