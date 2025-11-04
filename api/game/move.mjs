
import { kv } from '@vercel/kv';

// 勝利判定ロジック
const checkWinner = (board) => {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],           // diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null; // No winner
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { gameId, player, index } = await request.json();

    if (!gameId || !player || index === undefined) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
    }

    const gameState = await kv.get(`game:${gameId}`);

    if (!gameState) {
      return new Response(JSON.stringify({ message: 'Game not found' }), { status: 404 });
    }

    // --- バリデーション ---
    if (gameState.status !== 'waiting' && gameState.status !== 'playing') {
      return new Response(JSON.stringify({ message: 'Game is already over.' }), { status: 400 });
    }
    if (gameState.turn !== player) {
      return new Response(JSON.stringify({ message: 'Not your turn.' }), { status: 400 });
    }
    if (gameState.board[index] !== null) {
      return new Response(JSON.stringify({ message: 'This cell is already taken.' }), { status: 400 });
    }

    // --- ゲームロジックの更新 ---
    const newBoard = [...gameState.board];
    newBoard[index] = player;

    const winner = checkWinner(newBoard);
    const isDraw = !winner && newBoard.every(cell => cell !== null);
    
    let newStatus = 'playing';
    if(gameState.status === 'waiting') newStatus = 'playing';
    if (winner) {
      newStatus = `win_${winner}`;
    } else if (isDraw) {
      newStatus = 'draw';
    }
    
    const newTurn = player === 'X' ? 'O' : 'X';

    const newGameState = {
      ...gameState,
      board: newBoard,
      turn: newTurn,
      status: newStatus,
    };
    
    await kv.set(`game:${gameId}`, newGameState);

    return new Response(JSON.stringify(newGameState), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing move:', error);
    return new Response(JSON.stringify({ message: 'Failed to process move' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
