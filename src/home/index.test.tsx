import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import Home from './index';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { data as mockSpices } from '../mocks/data/spices';
import { data as mockBlends } from '../mocks/data/blends';

// Create a test QueryClient for tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

// Create wrapper with MemoryRouter and QueryClientProvider
const renderWithProviders = (ui: React.ReactElement) => {
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

test('renders home page with spices and blends', async () => {
  renderWithProviders(<Home />);

  // Check that main heading is rendered
  expect(screen.getByRole('heading', { name: /tomo's famous spice rack/i })).toBeInTheDocument();
  
  // Check that search input is rendered
  expect(screen.getByPlaceholderText(/search spices and blends/i)).toBeInTheDocument();
  
  // Wait for spices and blends to be loaded
  await waitFor(() => {
    expect(screen.getByRole('link', { name: /adobo/i })).toBeInTheDocument();
  });
  
  // Check that at least one blend is rendered
  const firstBlend = mockBlends()[0];
  await waitFor(() => {
    expect(screen.getByText(firstBlend.name)).toBeInTheDocument();
  });
});

test('shows error state when API fails', async () => {
  // Temporarily override the handlers for this test
  server.use(
    http.get('/api/v1/spices', () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get('/api/v1/blends', () => {
      return new HttpResponse(null, { status: 500 });
    })
  );
  
  renderWithProviders(<Home />);
  
  // Wait for error messages to appear
  await waitFor(() => {
    expect(screen.getAllByText(/error loading/i).length).toBeGreaterThan(0);
  });
});

test('filters spices and blends based on search string', async () => {
  renderWithProviders(<Home />);
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByRole('link', { name: /adobo/i })).toBeInTheDocument();
  });
  
  // Type in search box
  const searchInput = screen.getByPlaceholderText(/search spices and blends/i);
  fireEvent.change(searchInput, { target: { value: 'cinna' } }); // Search for cinnamon
  
  // Check that filtered results appear
  await waitFor(() => {
    // Find spices with 'cinna' in the name
    const cinnamonSpices = mockSpices().filter(spice => 
      spice.name.toLowerCase().includes('cinna')
    );
    
    if (cinnamonSpices.length > 0) {
      expect(screen.getByText(cinnamonSpices[0].name)).toBeInTheDocument();
    }
    
    // Find blends with 'cinna' in the name
    const cinnamonBlends = mockBlends().filter(blend => 
      blend.name.toLowerCase().includes('cinna')
    );
    
    if (cinnamonBlends.length > 0) {
      expect(screen.getByText(cinnamonBlends[0].name)).toBeInTheDocument();
    }
  });
});
