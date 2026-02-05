import { http } from './http';

export async function getAnimals() {
  const { data } = await http.get('/animals');
  return data;
}

export async function getAnimal(id) {
  const { data } = await http.get(`/animals/${id}`);
  return data;
}

export async function createAnimal(payload) {
  const { data } = await http.post('/animals', payload);
  return data;
}
