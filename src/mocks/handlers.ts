import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as mockBlends } from './data/blends';
import { Blend } from '../types';

// In-memory storage for blends created during the session
const createdBlends: Blend[] = [];

export const handlers = [
  http.get('/api/v1/spices', () => {
    return HttpResponse.json(mockSpices());
  }),
  http.get('/api/v1/spices/:id', ({ params }) => {
    const spice = mockSpices().find((spice) => spice.id === Number(params.id));

    if (!spice) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json(spice);
  }),
  http.get('/api/v1/blends', () => {
    // Return both predefined and session-created blends
    return HttpResponse.json([...mockBlends(), ...createdBlends]);
  }),
  http.post('/api/v1/blends', async ({ request }) => {
    try {
      const blendData = await request.json();
      
      // Generate a new ID (higher than any existing ID to avoid conflicts)
      const existingIds = [...mockBlends(), ...createdBlends].map(blend => blend.id);
      const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1000;
      
      // Create the new blend with an ID
      const newBlend: Blend = {
        id: newId,
        ...blendData as Omit<Blend, 'id'>
      };
      
      // Store in our session memory
      createdBlends.push(newBlend);
      
      return HttpResponse.json({ success: true, blend: newBlend });
    } catch {
      return new HttpResponse('Invalid blend data', { status: 400 });
    }
  }),
  http.get('/api/v1/blends/:id', ({ params }) => {
    // Check both predefined and session-created blends
    const blend = [...mockBlends(), ...createdBlends].find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json(blend);
  }),
];
