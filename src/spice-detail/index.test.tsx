import { render, screen, waitFor } from '@testing-library/react';
import { vi, expect, test } from 'vitest';
import SpiceDetail from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { data as mockSpices } from '../mocks/data/spices';

// Mock react-router-dom's useParams
vi.mock('react-router-dom', async () => {
  const originalRouter = await vi.importActual('react-router-dom');
  return {
    ...originalRouter,
    useParams: () => {
      return {
        id: '0',
      };
    },
  };
});

// Create a test QueryClient for tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Turn off retries for tests to avoid waiting for retry attempts
      retry: false,
      // Don't cache query results between tests
      gcTime: 0,
      // Don't refetch on window focus for tests
      refetchOnWindowFocus: false,
    },
  },
});

// Create wrapper with QueryClientProvider and MemoryRouter
const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          {ui}
        </MemoryRouter>
      </QueryClientProvider>
    ),
    testQueryClient,
  };
};

test('renders spice detail page', async () => {
  // Mock the specific spice data for ID 0
  const mockSpice = mockSpices().find(spice => spice.id === 0);
  
  renderWithClient(<SpiceDetail />);

  // Check for loading state first
  expect(screen.getByRole('heading', { name: /spice details/i })).toBeInTheDocument();
  
  // Wait for the spice name to appear after data is fetched
  await waitFor(() => {
    expect(screen.getByText(mockSpice!.name)).toBeInTheDocument();
  });
  
  // Check other details are displayed
  expect(screen.getByText(`$${mockSpice!.price}`)).toBeInTheDocument();
});

test('shows error state when API fails', async () => {
  // Temporarily override the handler for this test
  server.use(
    http.get('/api/v1/spices/0', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  renderWithClient(<SpiceDetail />);
  
  await waitFor(() => {
    expect(screen.getByText(/error loading spice/i)).toBeInTheDocument();
  });
});
