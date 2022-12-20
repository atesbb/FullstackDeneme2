import { CreateMovie, UpdateMovie } from '@types';

const headers = { 'Content-Type': 'application/json' };

// TODO: refactor and make a better api client
export async function updateMovie(body: UpdateMovie, id: string) {
  // TODO: investigate why proxy is not working to avoid passing full url
  return fetch(`http://localhost:3333/api/v1/movies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers,
  });
}

export async function createMovie(body: CreateMovie, id: string) {
  return fetch(`http://localhost:3333/api/v1/movies`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
}

export async function deleteMovie(id: string) {
  return fetch(`http://localhost:3333/api/v1/movies/${id}`, {
    method: 'DELETE',
    headers,
  });
}
