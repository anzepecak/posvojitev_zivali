import { http } from './http';

export async function login(email, password) {
  const { data } = await http.post('/auth/login', { email, password });

  const token =
    data?.token ??
    data?.access_token ??
    data?.accessToken ??
    data?.jwt ??
    data?.jwtToken;

  if (token) localStorage.setItem('token', token);

  return token;
}

export async function register(email, password, name) {
  const { data } = await http.post('/auth/register', { email, password, name });
  return data;
}

export async function me() {
  const { data } = await http.get('/auth/me');
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
