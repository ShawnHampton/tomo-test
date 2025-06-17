import { Spice } from "../types";

export const fetchSpices = async (): Promise<Spice[]> => {
  const response = await fetch('/api/v1/spices');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const fetchSpiceById = async (id: number): Promise<Spice> => {
  const response = await fetch(`/api/v1/spices/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}