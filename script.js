const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');

let currentPlayer = 'X';
let board = Array(9).fill(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(null) ? null : 'Tie';
}

function aiMove() {
  // Simple AI logic: try to win, block the player, or pick the first available spot
  // 1. Check for winning move
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O';
      if (checkWinner() === 'O') return i; // Winning move
      board[i] = null;
    }
  }

  // 2. Block player's winning move
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'X';
      if (checkWinner() === 'X') {
        board[i] = null;
        return i; // Block player
      }
      board[i] = null;
    }
  }

  // 3. Pick the first available spot
  return board.findIndex(cell => cell === null);
}

function handleClick(e) {
  const cell = e.target;
  const index = Array.from(cells).indexOf(cell);

  if (board[index] || checkWinner()) return;

  // Player's move
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add('taken');

  const winner = checkWinner();
  if (winner) {
    statusText.textContent = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
    return;
  }

  // Switch to AI's turn
  currentPlayer = 'O';
  statusText.textContent = `${currentPlayer}'s Turn`;

  // AI's move
  setTimeout(() => {
    const aiIndex = aiMove();
    if (aiIndex !== -1) {
      board[aiIndex] = 'O';
      cells[aiIndex].textContent = 'O';
      cells[aiIndex].classList.add('taken');

      const winner = checkWinner();
      if (winner) {
        statusText.textContent = winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`;
        return;
      }

      currentPlayer = 'X';
      statusText.textContent = `${currentPlayer}'s Turn`;
    }
  }, 500); // Add a small delay for AI move
}

function restartGame() {
  board.fill(null);
  currentPlayer = 'X';
  statusText.textContent = `${currentPlayer}'s Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);

statusText.textContent = `${currentPlayer}'s Turn`;
