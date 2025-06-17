import { Blend } from "../types";

export const fetchBlends = async (): Promise<Blend[]> => {
  const response = await fetch('/api/v1/blends');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const fetchBlendById = async (id: number): Promise<Blend> => {
  const response = await fetch(`/api/v1/blends/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
