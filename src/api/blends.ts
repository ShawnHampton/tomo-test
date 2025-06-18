import { Blend, Spice } from "../types";
import { fetchSpiceById } from "./spices";

/**
 * Fetches all blends from the API
 * @returns A Promise resolving to an array of Blend objects
 * @throws Error if the network request fails
 */
export const fetchBlends = async (): Promise<Blend[]> => {
    const response = await fetch('/api/v1/blends');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

/**
 * Fetches a single blend by its ID from the API
 * @param id The ID of the blend to fetch
 * @returns A Promise resolving to a Blend object
 * @throws Error if the network request fails
 */
export const fetchBlendById = async (id: number): Promise<Blend> => {
    const response = await fetch(`/api/v1/blends/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

/**
 * Creates a new blend
 * @param blend The blend data to create
 * @returns A Promise resolving to the created blend or success response
 * @throws Error if the network request fails
 */
export const createBlend = async (blend: Omit<Blend, "id">): Promise<{success: boolean}> => {
    const response = await fetch('/api/v1/blends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blend),
    });
    
    if (!response.ok) {
        throw new Error('Failed to create blend');
    }
    
    return response.json();
};

/**
 * Recursively fetches a blend and all its sub-blends, and returns a list of unique spices
 * @param blendId The ID of the blend to start with
 * @returns A Promise resolving to an array of unique Spice objects
 */
export const fetchBlendSpicesRecursive = async (blendId: number): Promise<Spice[]> => {
  // Track visited blend IDs to avoid infinite loops with circular references
  const visitedBlendIds = new Set<number>();
  
  // Use a Map to store unique spices by ID
  const spicesMap = new Map<number, Spice>();
  
  // Inner recursive function to process each blend
  async function processBlend(id: number): Promise<void> {
    // Skip if we've already visited this blend
    if (visitedBlendIds.has(id)) return;
    
    // Mark as visited
    visitedBlendIds.add(id);
    
    try {
      // Fetch the blend
      const blend = await fetchBlendById(id);
      
      // Process direct spices
      if (blend.spices && blend.spices.length > 0) {
        // Fetch all spices in parallel
        const spicePromises = blend.spices.map(spiceId => 
          fetchSpiceById(spiceId)
            .then(spice => {
              // Add to our map of unique spices
              spicesMap.set(spice.id, spice);
            })
            .catch(error => {
              console.error(`Error fetching spice ${spiceId}:`, error);
            })
        );
        await Promise.all(spicePromises);
      }
      
      // Recursively process sub-blends
      if (blend.blends && blend.blends.length > 0) {
        // Process all sub-blends in parallel
        const blendPromises = blend.blends.map(subBlendId => 
          processBlend(subBlendId)
        );
        await Promise.all(blendPromises);
      }
    } catch (error) {
      console.error(`Error processing blend ${id}:`, error);
    }
  }
  
  // Start the recursive process with the initial blend ID
  await processBlend(blendId);
  
  // Convert the Map values to an array
  return Array.from(spicesMap.values());
};
