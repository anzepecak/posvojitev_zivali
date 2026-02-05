import { http } from './http';

export async function createApplication(animalId, message) {
  const { data } = await http.post('/adoption-applications', {
    animalId,
    message,
  });
  return data;
}

export async function myApplications() {
  const { data } = await http.get('/adoption-applications/my');
  return data;
}

export async function applicationsForAnimal(animalId) {
  const { data } = await http.get(`/adoption-applications/animal/${animalId}`);
  return data;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await http.patch(`/adoption-applications/${id}/status`, {
    status,
  });
  return data;
}
