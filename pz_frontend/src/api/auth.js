import { http } from './http';

export async function login(email, password) {
  const { data } = await http.post('/auth/login', { email, password });

  if (data?.token) localStorage.setItem('token', data.token);
  if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));

  return data?.user ?? null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
