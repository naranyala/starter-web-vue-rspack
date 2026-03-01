# Architecture Overview

This document provides an overview of the application architecture, design patterns, and key architectural decisions.

## Table of Contents

- [Application Architecture](#application-architecture)
- [Directory Structure](#directory-structure)
- [Design Patterns](#design-patterns)
- [Data Flow](#data-flow)
- [Module Organization](#module-organization)
- [State Management](#state-management)
- [Component Architecture](#component-architecture)

## Application Architecture

The application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Views     │  │ Components  │  │    ViewModels       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                       Business Logic Layer                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Use Cases  │  │  Composables │  │     Stores         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                        Data Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Services   │  │  Repositories│  │      Models        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      Infrastructure Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Plugins   │  │   Core      │  │     Utilities      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### src/components

Reusable UI components that are presentational and stateless:

- Should not contain business logic
- Receive data via props
- Emit events for user interactions
- Can be used across multiple views

### src/views

Page-level components that compose other components:

- Represent full pages or routes
- Connect to stores and services
- Handle route-specific logic
- Compose multiple components

### src/composables

Reusable composition functions (Vue 3 hooks):

- Encapsulate reusable logic
- Can use Vue reactivity
- Follow the `useXxx` naming convention
- Can be used in components and other composables

### src/stores

Pinia store definitions for state management:

- Centralized application state
- Business logic for state mutations
- Actions for async operations
- Getters for computed state

### src/services

Application services for external communication:

- API clients
- WebUI bridge for backend communication
- Logger service
- WebSocket management

### src/models

Domain models and business entities:

- Type definitions
- Data transfer objects (DTOs)
- Domain entities
- Value objects

### src/use-cases

Business logic use cases:

- Encapsulate specific business operations
- Can be reused across the application
- Independent of UI framework
- Testable in isolation

### src/viewmodels

View models that bridge views and business logic:

- Prepare data for display
- Handle view-specific logic
- Coordinate between views and stores

### src/plugins

Vue plugins and extensions:

- System info plugin
- Database plugin
- Custom Vue directives

### src/core

Core utilities and shared functionality:

- Error tracking
- Global error handlers
- Application initialization

### src/lib

Shared libraries and utilities:

- Dependency injection container
- Shared helpers
- Common utilities

## Design Patterns

### Composition API

The application uses Vue 3 Composition API for component logic:

```typescript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const loading = ref(false);

const users = computed(() => userStore.users);

onMounted(async () => {
  loading.value = true;
  await userStore.fetchUsers();
  loading.value = false;
});
</script>
```

### MVVM Pattern

The application follows a Model-View-ViewModel pattern:

- **Model**: Domain entities and data structures
- **View**: Vue components (templates)
- **ViewModel**: ViewModels that prepare data for views

### Repository Pattern

Data access is abstracted through repositories:

```typescript
interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User>;
  delete(id: number): Promise<void>;
}
```

### Dependency Injection

The application uses a simple DI container for service registration:

```typescript
// Registration
container().registerInstance('logger', Logger);
container().registerInstance('webuiBridge', WebUIBridge);

// Usage
const logger = container().resolve<Logger>('logger');
```

## Data Flow

### Unidirectional Data Flow

```
User Action → Component → ViewModel → Store → Service → Backend
                ↑                                      ↓
                └────────── State Update ──────────────┘
```

### Event Flow

1. User interacts with component
2. Component emits event
3. ViewModel handles event
4. Store action is dispatched
5. Service makes API call
6. Backend responds
7. Store state is updated
8. Component re-renders

## Module Organization

### Feature Modules

Features are organized by domain:

```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── use-cases/
│   └── product/
│       ├── components/
│       ├── composables/
│       ├── stores/
│       └── use-cases/
```

### Shared Modules

Shared functionality is in common directories:

```
src/
├── components/      # Shared components
├── composables/     # Shared composables
├── services/        # Shared services
└── lib/            # Shared utilities
```

## State Management

### Pinia Stores

State is managed using Pinia:

```typescript
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    activeUsers: (state) => state.users.filter(u => u.active),
  },
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        this.users = await userService.findAll();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### State Organization

- **Local State**: Component-level state with `ref` and `reactive`
- **Shared State**: Pinia stores for cross-component state
- **Server State**: Managed by composables with caching

## Component Architecture

### Component Types

#### Presentational Components

- Receive data via props
- Emit events for interactions
- No direct store access
- Highly reusable

```vue
<script setup lang="ts">
defineProps<{
  title: string;
  count: number;
}>();

defineEmits<{
  click: [];
  increment: [];
}>();
</script>
```

#### Container Components

- Connect to stores
- Fetch data
- Compose presentational components
- Handle business logic

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import UserList from '@/components/UserList.vue';

const userStore = useUserStore();
const users = computed(() => userStore.users);
</script>

<template>
  <UserList :users="users" />
</template>
```

### Component Communication

#### Parent to Child

Use props for downward data flow:

```vue
<ChildComponent :user="selectedUser" :editable="true" />
```

#### Child to Parent

Use events for upward communication:

```vue
<ChildComponent @save="handleSave" @cancel="handleCancel" />
```

#### Sibling Components

Use a shared store or event bus:

```typescript
const store = useSharedStore();
```

## Best Practices

### File Naming

- Components: PascalCase (e.g., `UserProfile.vue`)
- Composables: camelCase with `use` prefix (e.g., `useUser.ts`)
- Stores: camelCase with `Store` suffix (e.g., `userStore.ts`)
- Services: camelCase (e.g., `userService.ts`)
- Types: PascalCase (e.g., `User.ts`)

### Code Organization

1. Keep components focused and single-purpose
2. Extract reusable logic to composables
3. Use stores for shared state
4. Keep business logic out of components
5. Use TypeScript for type safety

### Performance

1. Use `computed` for derived state
2. Lazy load routes and components
3. Virtualize long lists
4. Debounce user input
5. Cache API responses

## Related Documentation

- [CSS Guide](./css-guide.md)
- [TypeScript Guide](./typescript-guide.md)
- [Deployment Guide](./deployment.md)
