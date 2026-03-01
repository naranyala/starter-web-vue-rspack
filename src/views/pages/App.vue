<template>
  <ErrorBoundary>
    <div class="app">
      <AppSidebar
        :windows="activeWindows"
        @home="hideAllWindows"
        @toggle="toggleWindow"
        @close="closeWindow"
      />

      <div class="main-container">
        <header class="header">
          <h1>System Dashboard</h1>
        </header>

        <main class="main-content">
          <section class="cards-section">
            <div class="cards-grid two-cards">
              <FeatureCard
                icon="[System]"
                title="System Information"
                description="View detailed system information including OS, memory, CPU, and runtime statistics."
                :tags="['Hardware', 'Stats']"
                @click="openSystemInfoWindow"
              />

              <FeatureCard
                icon="[DB]"
                title="SQLite Database"
                description="Interactive database viewer with sample data. Connects to backend SQLite integration."
                :tags="['Database', 'Mockup']"
                @click="openSQLiteWindow"
              />
            </div>
          </section>
        </main>
      </div>

      <DevTools />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AppSidebar from '../../components/AppSidebar.vue';
import DevTools from '../../components/DevTools.vue';
import ErrorBoundary from '../../components/ErrorBoundary.vue';
import FeatureCard from '../../components/FeatureCard.vue';
import {
  generateSQLiteHTML,
  generateSystemInfoHTML,
  type User,
  updateSQLiteTable,
} from '../../composables/useWindowContent.ts';
import { useWindowManager, type WindowInfo } from '../../composables/useWindowManager.ts';

const activeWindows = ref<WindowInfo[]>([]);
const { openWindow, toggleWindow, closeWindow, hideAllWindows } = useWindowManager(activeWindows);

const dbUsers = ref<User[]>([]);
const isLoadingUsers = ref(false);

const openSystemInfoWindow = () => {
  openWindow('System Information', generateSystemInfoHTML(), '[System]');
};

const openSQLiteWindow = () => {
  isLoadingUsers.value = true;
  console.log('Opening SQLite window, fetching users from backend...');

  if ((window as any).getUsers) {
    console.log('Calling Rust backend get_users function');
    (window as any).getUsers();
  }

  if ((window as any).getDbStats) {
    (window as any).getDbStats();
  }

  openWindow('SQLite Database', generateSQLiteHTML(dbUsers.value), '[DB]');
};

(window as any).refreshUsers = () => {
  console.log('Refreshing users from database');
  isLoadingUsers.value = true;
  if ((window as any).getUsers) {
    (window as any).getUsers();
  }
};

(window as any).searchUsers = () => {
  const searchInput = document.getElementById('db-search') as HTMLInputElement;
  const searchTerm = searchInput?.value.toLowerCase() || '';
  console.log('Searching users', { term: searchTerm });

  const tableBody = document.getElementById('users-table-body');
  if (tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row: any) => {
      const text = row.textContent?.toLowerCase() || '';
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  }
};

onMounted(() => {
  console.log('Application initialized');

  window.addEventListener('db_response', ((event: CustomEvent) => {
    const response = event.detail;
    if (response.success) {
      dbUsers.value = response.data || [];
      console.log('Users loaded from database', { count: dbUsers.value.length });
      updateSQLiteTable(dbUsers.value);
    } else {
      console.error('Failed to load users', { error: response.error });
    }
    isLoadingUsers.value = false;
  }) as EventListener);

  window.addEventListener('stats_response', ((event: CustomEvent) => {
    const response = event.detail;
    if (response.success) {
      console.log('Database stats loaded', response.stats);
    }
  }) as EventListener);
});
</script>

<style>
:root {
  --sidebar-width: 200px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  font-size: 14px;
}

/* Hide WinBox default taskbar/minimize bar - we use our own sidebar */
.winbox-taskbar,
.winbox-minimized-row,
.winbox .winbox-control-bottom,
.wb-taskbar,
.wb-minimized-row,
.winbox-footer,
.winbox-minimize-bar,
#winbox-taskbar,
.winbox-row {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.header {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 1.2rem;
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 1rem;
  padding-bottom: calc(1rem + 40px);
  overflow-y: auto;
}

.cards-section {
  padding: 1.5rem;
}

.cards-grid {
  display: grid;
  gap: 1.5rem;
}

.cards-grid.two-cards {
  grid-template-columns: repeat(2, 1fr);
  max-width: 900px;
  margin: 0 auto;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    max-height: none;
    border-right: none;
    border-bottom: 1px solid #334155;
  }

  .home-button-container {
    background: rgba(79, 70, 229, 0.3);
  }

  .home-btn {
    max-width: 120px;
    margin: 0 auto;
  }

  .header {
    padding: 0.75rem 1rem;
  }

  .header h1 {
    font-size: 1rem;
  }

  .main-content {
    padding: 0.75rem;
    padding-bottom: calc(0.75rem + 40px);
  }

  .cards-section {
    padding: 0.75rem;
  }

  .cards-grid.two-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    min-height: 180px;
  }

  .card-icon {
    font-size: 2.5rem;
    padding: 1.5rem 1rem 0.75rem;
  }

  .card-content {
    padding: 1rem;
  }

  .card-title {
    font-size: 1.1rem;
  }

  .card-description {
    font-size: 0.85rem;
  }
}

/* Small mobile devices */
@media (max-width: 480px) {
  .card-icon {
    font-size: 2rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.8rem;
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.25rem 0.6rem;
  }
}
</style>
