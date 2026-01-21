import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app/App';
import './styles/index.css';
import { ThemeProvider } from './app/components/theme-provider';

// MSW Setup
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  
  // Set this to true to enable MSW
  const ENABLE_MSW = false; 

  if (ENABLE_MSW) {
    const { worker } = await import('./mocks/browser');
    // Start the worker
    return worker.start({
      onUnhandledRequest: 'bypass', // Don't warn for unhandled requests (like assets)
    });
  }
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
