import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchBlends, fetchBlendById } from './blends';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { data as mockBlends } from '../mocks/data/blends';

describe('Blends API', () => {
  beforeEach(() => {
    // Reset fetch mocks between tests
    vi.restoreAllMocks();
  });

  describe('fetchBlends', () => {
    test('should return an array of blends when request is successful', async () => {
      // Act
      const result = await fetchBlends();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('spices');
    });

    test('should throw an error when request fails', async () => {
      // Arrange
      server.use(
        http.get('/api/v1/blends', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      // Act and Assert
      await expect(fetchBlends()).rejects.toThrow('Network response was not ok');
    });
  });

  describe('fetchBlendById', () => {
    test('should return a single blend when request is successful', async () => {
      // Arrange
      const blendId = 1;
      const mockBlend = mockBlends().find(blend => blend.id === blendId);

      // Act
      const result = await fetchBlendById(blendId);

      // Assert
      expect(result).toHaveProperty('id', blendId);
      expect(result).toHaveProperty('name', mockBlend?.name);
      expect(Array.isArray(result.spices)).toBe(true);
    });

    test('should throw an error when request fails', async () => {
      // Arrange
      const nonExistentId = 999999;
      server.use(
        http.get(`/api/v1/blends/${nonExistentId}`, () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      // Act and Assert
      await expect(fetchBlendById(nonExistentId)).rejects.toThrow('Network response was not ok');
    });
  });
});
