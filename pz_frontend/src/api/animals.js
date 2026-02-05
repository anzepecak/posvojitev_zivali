import { http } from './http';

export async function getAnimals() {
  const { data } = await http.get('/animals'); // če imaš /api prefix, tu spremeni
  return data;
}

export async function getAnimal(id) {
  const { data } = await http.get(`/animals/${id}`);
  return data;
}
