import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import './styles/index.css';
import { ThemeProvider } from './app/components/theme-provider';

// MSW Setup
async function enableMocking() {
  // 1. Manual Override via VITE_USE_MSW (Highest Priority)
  // This allows enabling MSW in production/Vercel if explicitly set
  const useMsw = import.meta.env.VITE_USE_MSW;

  if (useMsw === 'true') {
    console.log('[App] VITE_USE_MSW is true. Starting MSW...');
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }

  if (useMsw === 'false') {
    console.log('[App] VITE_USE_MSW is false. MSW skipped.');
    return;
  }

  // 2. Default Behavior: Only run in development mode
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  // 3. Auto Mode (Development Only): Check if Backend is reachable
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  console.log('[App] Checking backend availability...');
  try {
    // Try to reach the server with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Increased timeout to 2000ms

    await fetch(backendUrl, {
      method: 'HEAD', // Lightweight check
      mode: 'no-cors', // Avoid CORS errors during check
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('[App] Backend detected. MSW skipped.');
    return;
  } catch (error) {
    // Expected error if backend is down
    console.log(
      '[App] Backend unreachable or check timed out. Starting MSW...',
    );
  }

  const { worker } = await import('./mocks/browser');
  // Start the worker
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn for unhandled requests (like assets)
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
});
