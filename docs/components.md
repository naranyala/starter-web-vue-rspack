# Component Development Guide

This document provides guidance on developing Vue components in the application, including patterns, conventions, and best practices.

## Table of Contents

- [Component Types](#component-types)
- [Component Structure](#component-structure)
- [Props](#props)
- [Events](#events)
- [Slots](#slots)
- [Component Composition](#component-composition)
- [State Management](#state-management)
- [Styling](#styling)
- [Testing Components](#testing-components)
- [Best Practices](#best-practices)

## Component Types

### Presentational Components

Presentational (dumb) components focus on UI rendering:

- Receive data via props
- Emit events for interactions
- No direct store access
- Highly reusable

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count: number;
  disabled?: boolean;
}

interface Emits {
  (e: 'click'): void;
  (e: 'increment'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="card" :class="{ disabled }">
    <h3>{{ title }}</h3>
    <p>Count: {{ count }}</p>
    <button @click="emit('click')" :disabled="disabled">
      Click me
    </button>
  </div>
</template>

<style scoped>
.card.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
```

### Container Components

Container (smart) components handle business logic:

- Connect to stores
- Fetch data
- Compose presentational components
- Handle business logic

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserList from '@/components/UserList.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const userStore = useUserStore();

const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

async function handleDelete(userId: number) {
  await userStore.deleteUser(userId);
}
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <UserList v-else :users="users" @delete="handleDelete" />
  </div>
</template>
```

### Layout Components

Layout components structure the page:

```vue
<script setup lang="ts">
interface Slots {
  header: Record<string, never>;
  sidebar: Record<string, never>;
  default: Record<string, never>;
  footer: Record<string, never>;
}

defineSlots<Slots>();
</script>

<template>
  <div class="layout">
    <header class="layout-header">
      <slot name="header" />
    </header>
    <aside class="layout-sidebar">
      <slot name="sidebar" />
    </aside>
    <main class="layout-main">
      <slot />
    </main>
    <footer class="layout-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
</style>
```

## Component Structure

### File Organization

Organize component files consistently:

```
src/components/
├── Button/
│   ├── Button.vue
│   ├── Button.stories.ts
│   └── __tests__/
│       └── Button.test.ts
├── Card/
│   └── Card.vue
└── Modal/
    └── Modal.vue
```

### Component Template Structure

Order template sections logically:

```vue
<template>
  <!-- 1. Conditional rendering -->
  <div v-if="visible" class="component">
    <!-- 2. Lists -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    
    <!-- 3. Content -->
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    
    <!-- 4. Interactive elements -->
    <button @click="handleClick">Action</button>
  </div>
</template>
```

### Script Structure

Order script sections consistently:

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/stores/store';
import OtherComponent from '@/components/OtherComponent.vue';

// 2. Props
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// 3. Emits
interface Emits {
  (e: 'update', value: string): void;
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

// 4. Slots
interface Slots {
  header: { title: string };
  default: Record<string, never>;
}

defineSlots<Slots>();

// 5. State
const localState = ref('');

// 6. Computed
const computedValue = computed(() => props.title.toUpperCase());

// 7. Watchers
watch(() => props.title, (newVal) => {
  console.log('Title changed:', newVal);
});

// 8. Lifecycle hooks
onMounted(() => {
  console.log('Component mounted');
});

// 9. Methods
function handleClick() {
  emit('update', localState.value);
}
</script>
```

## Props

### Prop Definitions

Define props with TypeScript interfaces:

```vue
<script setup lang="ts">
interface Props {
  // Required primitive
  title: string;
  
  // Optional with default
  count?: number;
  
  // Array type
  items: Array<{ id: number; name: string }>;
  
  // Union type
  variant: 'primary' | 'secondary' | 'danger';
  
  // Function type
  onClick: (event: MouseEvent) => void;
  
  // Component instance
  icon?: typeof SomeIconComponent;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary',
});
</script>
```

### Prop Validation

Use withDefaults for default values:

```typescript
interface Props {
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  maxItems: number;
  labels: string[];
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  disabled: false,
  maxItems: 10,
  labels: () => [],
});
```

### Prop Naming

- Use camelCase for prop names
- Use descriptive names
- Prefix boolean props with is, has, can, should

```typescript
interface Props {
  isLoading: boolean;
  hasError: boolean;
  canSubmit: boolean;
  shouldValidate: boolean;
  itemCount: number;
  selectedUserId: number;
}
```

## Events

### Event Definitions

Define events with TypeScript:

```vue
<script setup lang="ts">
interface Emits {
  // Simple event
  (e: 'click'): void;
  
  // Event with payload
  (e: 'update', value: string): void;
  
  // Event with multiple arguments
  (e: 'change', id: number, value: unknown): void;
  
  // Event with object payload
  (e: 'submit', data: { name: string; email: string }): void;
}

const emit = defineEmits<Emits>();
</script>
```

### Event Naming

- Use kebab-case in templates
- Use camelCase in TypeScript
- Use past tense for completed actions
- Use present tense for ongoing actions

```typescript
interface Emits {
  (e: 'click'): void;
  (e: 'submitted'): void;
  (e: 'updated'): void;
  (e: 'loading'): void;
}
```

```vue
<template>
  <button @click="emit('click')">Click</button>
  <form @submit.prevent="emit('submitted')">Submit</form>
</template>
```

### Event Handler Patterns

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();

// Inline handler
const handleInline = () => emit('update', 'value');

// Named handler
function handleDelete(id: number) {
  emit('delete', id);
}

// Async handler
async function handleSubmit(data: FormData) {
  try {
    await api.submit(data);
    emit('submitted');
  } catch (error) {
    emit('error', error);
  }
}
</script>
```

## Slots

### Slot Definitions

Define slots with TypeScript:

```vue
<script setup lang="ts">
interface Slots {
  // Default slot
  default: Record<string, never>;
  
  // Named slot
  header: Record<string, never>;
  
  // Scoped slot
  item: { item: unknown; index: number };
  
  // Multiple scoped slots
  cell: { row: unknown; column: string; value: unknown };
}

defineSlots<Slots>();
</script>
```

### Slot Usage

```vue
<template>
  <div class="card">
    <header>
      <slot name="header">
        <!-- Fallback content -->
        <h3>Default Header</h3>
      </slot>
    </header>
    
    <main>
      <slot>
        <!-- Default slot fallback -->
        <p>Default content</p>
      </slot>
    </main>
    
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### Scoped Slots

```vue
<!-- Parent component usage -->
<template>
  <DataTable :items="items">
    <template #item="{ item, index }">
      <div class="item">
        {{ index }}: {{ item.name }}
      </div>
    </template>
    
    <template #cell="{ row, column, value }">
      <span v-if="column === 'price'">
        ${{ value }}
      </span>
      <span v-else>{{ value }}</span>
    </template>
  </DataTable>
</template>
```

## Component Composition

### Composing Components

Build complex components from simpler ones:

```vue
<script setup lang="ts">
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';
import Icon from '@/components/Icon.vue';

interface Props {
  title: string;
  actions: Array<{ label: string; onClick: () => void }>;
}

defineProps<Props>();
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center gap-2">
        <Icon name="info" />
        <h2>{{ title }}</h2>
      </div>
    </template>
    
    <slot />
    
    <template #footer>
      <div class="flex gap-2">
        <Button
          v-for="action in actions"
          :key="action.label"
          @click="action.onClick"
        >
          {{ action.label }}
        </Button>
      </div>
    </template>
  </Card>
</template>
```

### Higher-Order Components

Create components that enhance other components:

```vue
<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue';

interface Props {
  component: unknown;
  props: T;
  condition: boolean;
}

const props = defineProps<Props>();

const shouldRender = computed(() => props.condition);
</script>

<template>
  <component :is="component" v-if="shouldRender" v-bind="props" />
</template>
```

## State Management

### Local State

Use ref and reactive for component state:

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue';

// Single value
const count = ref(0);

// Object
const form = reactive({
  name: '',
  email: '',
  subscribed: false,
});

// Array
const items = ref<string[]>([]);
</script>
```

### Computed State

Use computed for derived state:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const searchText = ref('');
const items = ref<Item[]>([]);

const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter(item =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const hasItems = computed(() => filteredItems.value.length > 0);
const itemCount = computed(() => filteredItems.value.length);
</script>
```

### Store Integration

Connect to Pinia stores:

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

// Access state
const users = computed(() => userStore.users);
const loading = computed(() => userStore.loading);

// Use getters
const activeUsers = computed(() => userStore.activeUsers);

// Call actions
async function handleDelete(userId: number) {
  await userStore.deleteUser(userId);
}
</script>
```

## Styling

### Scoped Styles

Use scoped styles for component-specific styling:

```vue
<template>
  <div class="card">
    <h3 class="title">{{ title }}</h3>
  </div>
</template>

<style scoped>
.card {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

.title {
  color: var(--color-text-primary);
}
</style>
```

### CSS Modules

Use CSS modules for locally scoped classes:

```vue
<template>
  <div :class="styles.container">
    <h3 :class="styles.title">{{ title }}</h3>
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

### Utility Classes

Combine utility classes with custom styles:

```vue
<template>
  <div class="card p-6 rounded-xl shadow bg-primary">
    <h3 class="text-xl font-semibold mb-4">{{ title }}</h3>
    <p class="text-secondary">{{ description }}</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid var(--color-border-primary);
  transition: var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-md);
}
</style>
```

## Testing Components

### Unit Tests

Test component logic:

```typescript
// __tests__/Button.test.ts
import { describe, it, expect } from 'bun:test';
import { mount } from '@vue/test-utils';
import Button from '@/components/Button.vue';

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' },
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(Button);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('respects disabled state', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
```

### Snapshot Tests

Test component rendering:

```typescript
import { test, expect } from 'bun:test';
import { mount } from '@vue/test-utils';
import Card from '@/components/Card.vue';

test('Card snapshot', () => {
  const wrapper = mount(Card, {
    props: {
      title: 'Test Card',
      description: 'Test description',
    },
  });
  expect(wrapper.html()).toMatchSnapshot();
});
```

## Best Practices

### Naming Conventions

- Component files: PascalCase (e.g., `UserProfile.vue`)
- Component names: PascalCase in templates
- Props: camelCase
- Events: kebab-case in templates, camelCase in TypeScript
- CSS classes: kebab-case

### Single Responsibility

Each component should have one clear purpose:

```vue
<!-- Good: Focused component -->
<UserAvatar :user="user" size="md" />
<UserInfo :user="user" />
<UserActions :user="user" />

<!-- Avoid: Doing too much -->
<UserProfile
  :user="user"
  show-avatar
  show-info
  show-actions
  show-stats
  show-history
/>
```

### Prop Drilling

Avoid excessive prop drilling by using stores or composables:

```vue
<!-- Avoid: Deep prop drilling -->
<template>
  <GrandParent :user="user">
    <Parent :user="user">
      <Child :user="user" />
    </Parent>
  </GrandParent>
</template>

<!-- Prefer: Store or composable -->
<template>
  <GrandParent>
    <Parent>
      <Child />
    </Parent>
  </GrandParent>
</template>

<script setup>
// In Child component
const { user } = useUser();
</script>
```

### Performance

1. Use `v-once` for static content
2. Use `v-memo` for expensive renders
3. Use `key` properly in lists
4. Lazy load heavy components
5. Virtualize long lists

```vue
<template>
  <!-- Static content -->
  <div v-once>{{ staticConfig }}</div>
  
  <!-- Expensive list -->
  <div v-memo="[items.length, searchQuery]">
    <ListItem v-for="item in filteredItems" :key="item.id" />
  </div>
</template>
```

### Documentation

Document component usage:

```vue
<!--
 * @description User profile card component
 * @usage
 *   <UserProfile
 *     :user="user"
 *     @edit="handleEdit"
 *     @delete="handleDelete"
 *   />
-->
<script setup lang="ts">
interface Props {
  /** User object to display */
  user: User;
  /** Show edit button */
  editable?: boolean;
}

interface Emits {
  /** Emitted when edit button is clicked */
  (e: 'edit', user: User): void;
  /** Emitted when delete button is clicked */
  (e: 'delete', userId: number): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
```

## Related Documentation

- [Architecture Overview](./architecture.md)
- [TypeScript Guide](./typescript-guide.md)
- [CSS Guide](./css-guide.md)
