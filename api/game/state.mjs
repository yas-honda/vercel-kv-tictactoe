
import { kv } from '@vercel/kv';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  
  const url = new URL(request.url, `http://${request.headers.host}`);
  const gameId = url.searchParams.get('id');

  if (!gameId) {
    return new Response(JSON.stringify({ message: 'Game ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const gameState = await kv.get(`game:${gameId}`);

    if (!gameState) {
      return new Response(JSON.stringify({ message: 'Game not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(gameState), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get game state:', error);
    return new Response(JSON.stringify({ message: 'Failed to retrieve game state' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
