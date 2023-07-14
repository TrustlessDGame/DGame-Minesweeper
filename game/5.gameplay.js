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
        isRevealed: false,
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
        if (
          i >= 0 &&
          i < rows &&
          j >= 0 &&
          j < columns &&
          !(i === row && j === col)
        ) {
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
      console.log("Game Over!");
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
  drawBoard(board);
}

function drawBoard(newBoard) {
  // Code to redraw the board
  const grid = document.getElementById("grid");
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  newBoard.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      const square = document.createElement("div");
      square.setAttribute("data-row", rowIndex);
      square.setAttribute("data-col", colIndex);
      square.setAttribute("class", "valid");
      square.classList.add("square");
      grid.appendChild(square);
      // squares.push(square);

      const cell = newBoard[rowIndex][colIndex];
      const cellElement = document.querySelector(
        `[data-row="${rowIndex}"][data-col="${colIndex}"]`
      );

      if (cell.isRevealed) {
        if (cell.isMine) {
          square.classList.add("mine");
        } else if (cell.adjacentMines > 0) {
          const classNumber = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
          };
          square.classList.add(`${classNumber[cell.adjacentMines]}`);
          square.innerHTML = cell.adjacentMines;
        } else {
          square.classList.add("checked");
        }
      }

      cellElement.addEventListener("click", function (e) {
        revealCell(board, rowIndex, colIndex);
      });
    });
  });
}

// Code
const rows = 10;
const columns = 10;
const numMines = 10;
const board = generateBoard(rows, columns, numMines);

document.addEventListener("DOMContentLoaded", () => {
  // const grid = document.getElementById("grid");
  // let squares = [];

  drawBoard(board);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
      );

      // normal click
      cell.addEventListener("click", function (e) {
        revealCell(board, row, col);
      });

      // cntrl and left click
      cell.oncontextmenu = function (e) {
        e.preventDefault();
        // addFlag(square);
      };
    }
  }
});
