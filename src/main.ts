import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { useErrorTracker } from './core/errorTracker';
import { logger } from './services';
import App from './views/pages/App.vue';

// Import global styles (reset, theme, utilities)
import './styles';

/**
 * Set up global error handlers for uncaught errors and promise rejections
 */
function setupGlobalErrorHandlers(): void {
  window.addEventListener('error', (event) => {
    logger.error(`[window.onerror] ${event.message}`, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
    return false;
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error(`[unhandledrejection] ${event.reason}`, {});
  });
}

/**
 * Log application startup information
 */
function logStartupInfo(): void {
  logger.info('=============================================');
  logger.info('Frontend starting...');
  logger.info('Version: 1.0.0');
  logger.info('=============================================');
}

/**
 * Initialize the Vue application
 */
function initializeApp(): void {
  const appEl = document.getElementById('app');
  
  if (!appEl) {
    console.error('[FATAL] Root element #app not found');
    return;
  }

  // Show loading state
  appEl.innerHTML = '<div style="padding:20px;text-align:center;"><h2>Initializing...</h2></div>';

  try {
    setupGlobalErrorHandlers();
    logStartupInfo();

    // Create Vue app and Pinia store
    const app = createApp(App);
    const pinia = createPinia();

    // Mount application
    app.use(pinia);
    app.mount('#app');

    // Expose error tracker globally for debugging
    (window as typeof window & { __errorTracker: ReturnType<typeof useErrorTracker> }).__errorTracker = 
      useErrorTracker();
    
    logger.info('Application initialized successfully');
  } catch (initError) {
    console.error('[FATAL INIT ERROR]', initError);
    appEl.innerHTML = `
      <div style="padding:20px;color:red;background:#ffe6e6;">
        <h2>Fatal Error</h2>
        <pre>${String(initError)}</pre>
      </div>
    `;
  }
}

// Start the application
initializeApp();
