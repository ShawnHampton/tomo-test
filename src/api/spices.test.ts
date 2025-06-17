import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchSpices, fetchSpiceById } from './spices';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { data as mockSpices } from '../mocks/data/spices';

describe('Spices API', () => {
  beforeEach(() => {
    // Reset fetch mocks between tests
    vi.restoreAllMocks();
  });

  describe('fetchSpices', () => {
    test('should return an array of spices when request is successful', async () => {
      // Act
      const result = await fetchSpices();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('color');
    });

    test('should throw an error when request fails', async () => {
      // Arrange
      server.use(
        http.get('/api/v1/spices', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      // Act and Assert
      await expect(fetchSpices()).rejects.toThrow('Network response was not ok');
    });
  });

  describe('fetchSpiceById', () => {
    test('should return a single spice when request is successful', async () => {
      // Arrange
      const spiceId = 1;
      const mockSpice = mockSpices().find(spice => spice.id === spiceId);

      // Act
      const result = await fetchSpiceById(spiceId);

      // Assert
      expect(result).toHaveProperty('id', spiceId);
      expect(result).toHaveProperty('name', mockSpice?.name);
      expect(result).toHaveProperty('color', mockSpice?.color);
    });

    test('should throw an error when request fails', async () => {
      // Arrange
      const nonExistentId = 999999;
      server.use(
        http.get(`/api/v1/spices/${nonExistentId}`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      // Act and Assert
      await expect(fetchSpiceById(nonExistentId)).rejects.toThrow('Network response was not ok');
    });
  });
});
