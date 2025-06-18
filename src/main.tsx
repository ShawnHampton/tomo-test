import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './main.css';
import Home from './home/index.tsx';
import SpiceDetail from './spice-detail/index.tsx';
import BlendDetail from './blend-detail/index.tsx';
import CreateBlend from './create-blend/index.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');

  return worker.start();
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      errorElement: <Home />,
    },
    {
      path: '/spices/:id',
      element: <SpiceDetail />,
    },    {
      path: '/blends/:id',
      element: <BlendDetail />,
    },
    {
      path: '/create-blend',
      element: <CreateBlend />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },  
});

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
