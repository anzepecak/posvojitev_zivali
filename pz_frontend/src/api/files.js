import { http } from './http';

export async function uploadAnimalImage(animalId, file) {
  const form = new FormData();
  form.append('file', file);

  const { data } = await http.post(`/files/animal/${animalId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}
