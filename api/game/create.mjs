
import { kv } from '@vercel/kv';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 6桁のランダムな英数字のゲームIDを生成
  const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const initialGameState = {
    board: Array(9).fill(null),
    turn: 'X',
    status: 'waiting', // 'waiting', 'playing', 'win_X', 'win_O', 'draw'
  };

  try {
    await kv.set(`game:${gameId}`, initialGameState);

    return new Response(JSON.stringify({ gameId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create game:', error);
    return new Response(JSON.stringify({ message: 'Failed to create game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
