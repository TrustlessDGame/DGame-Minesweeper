// Game play

// Function to generate the game board
function generateBoard(rows, columns, numMines) {
  const board = [];
  const mines = [];

  // Create an empty board
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = {
        isMine: false,
        adjacentMines: 0,
        isRevealed: false
      };
    }
  }

  // Randomly place mines on the board
  let placedMines = 0;
  while (placedMines < numMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      mines.push([row, col]);
      placedMines++;
    }
  }

  // Calculate the number of adjacent mines for each cell
  for (const [row, col] of mines) {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < rows && j >= 0 && j < columns && !(i === row && j === col)) {
          board[i][j].adjacentMines++;
        }
      }
    }
  }

  return board;
}

// Function to reveal a cell
function revealCell(board, row, col) {
  const cell = board[row][col];
  if (!cell.isRevealed) {
    cell.isRevealed = true;

    // If the cell is a mine, the game is over
    if (cell.isMine) {
      // Implement game over logic here
      console.log('Game Over!');
      return;
    }

    // If the cell has no adjacent mines, recursively reveal neighboring cells
    if (cell.adjacentMines === 0) {
      for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
            revealCell(board, i, j);
          }
        }
      }
    }
  }
}

// Code
const rows = 10;
const columns = 10;
const numMines = 10;
const board = generateBoard(rows, columns, numMines);

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  let squares = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const square = document.createElement("div");
      square.setAttribute("data-row", row);
      square.setAttribute("data-col", col);
      // square.setAttribute("class", 'valid');
      square.classList.add("square");
      grid.appendChild(square);
      squares.push(square);

      // normal click
      square.addEventListener("click", function (e) {
        revealCell(board, row, col);
      });

      // cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        // addFlag(square);
      };
    }
  }
})
