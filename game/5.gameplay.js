// Game play
const rows = 10;
const columns = 10;
const numMines = 10;
let flags = 0;
let board = generateBoard(rows, columns, numMines);
let gameStatus = 0; // 0 = Pending, 1 = Playing, -1 = Game Over
let stepCount = 0;
let playingTime = 0; // Seconds

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

function showGameOverScreen() {
  const gameOverScreen = document.getElementById("game-over");
  gameOverScreen.style.display = "block";
}

function hideGameOverScreen() {
  const gameOverScreen = document.getElementById("game-over");
  gameOverScreen.style.display = "none";
}

function restartGame() {
  hideGameOverScreen();
  board = generateBoard(rows, columns, numMines);
  drawBoard(board);
}

// Function to reveal a cell
function revealCell(board, row, col) {
  const cell = board[row][col];
  if (!cell.isRevealed) {
    cell.isRevealed = true;

    // If the cell is a mine, the game is over
    if (cell.isMine) {
      // Implement game over logic here
      showGameOverScreen();
      drawBoard(board);
      gameStatus = -1;
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

      const cell = newBoard[rowIndex][colIndex];
      const cellElement = document.querySelector(
        `[data-row="${rowIndex}"][data-col="${colIndex}"]`
      );

      if (cell.isRevealed) {
        if (cell.isMine) {
          square.innerHTML = "💣";
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

      cell.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(cellElement);
      };
    });
  });
}

//add Flag with right click
function addFlag(square) {
  if (gameStatus === -1) return;

  const flagsLeft = document.querySelector("#flags-left");

  if (!square.classList.contains("checked") && flags < numMines) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = " 🚩";
      flags++;
      flagsLeft.innerHTML = numMines - flags;
      // checkForWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
      flagsLeft.innerHTML = numMines - flags;
    }
    return;
  }
  if (
    !square.classList.contains("checked") &&
    square.classList.contains("flag")
  ) {
    square.classList.remove("flag");
    square.innerHTML = "";
    flags--;
    flagsLeft.innerHTML = numMines - flags;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const flagsLeft = document.querySelector("#flags-left");
  flagsLeft.innerHTML = numMines;

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
        addFlag(cell);
      };
    }
  }
});

window.addEventListener("keydown", function (event) {
  if (event.key === "x" || event.key === "X") {
    if (gameStatus === -1) {
      restartGame();
    }
  }
});
