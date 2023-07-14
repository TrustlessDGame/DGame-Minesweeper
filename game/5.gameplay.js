// Game play
let rows = 10;
let columns = 10;
let numMines = 10;
let flags = 0;
let board = generateBoard(rows, columns, numMines);
let gameStatus = 0; // 0 = Pending, 1 = Playing, -1 = Game Over
let stepCount = 0;
let playingTime = 0; // Seconds
let gameLevel = -1; // 0 = Beginner, 1 = Intermediate, 2 = Export, 3 = Mission Impossible


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

function showChooseGameLevelScreen() {
  document.getElementById('grid').style = 'block';
  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = 'block';
}

function hideChooseGameLevelScreen() {
  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = 'none';
}

function showGameOverScreen() {
  drawBoard(board, true);
  const gameOverScreen = document.getElementById("game-over");
  gameOverScreen.style.display = "block";
}

function hideGameOverScreen() {
  const gameOverScreen = document.getElementById("game-over");
  gameOverScreen.style.display = "none";
}

function startNewGame() {
  document.getElementById('grid').style.display = 'flex';
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
      gameStatus = -1;
      showGameOverScreen(board);
      //show ALL the bombs

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

function drawBoard(newBoard, isGameOver = false) {
  // Code to redraw the board
  const grid = document.getElementById("grid");
  grid.classList = '';
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
      if (gameLevel === 0) {
        grid.classList.add("beginner");
      }
      if (gameLevel === 1) {
        grid.classList.add("immediate");
      }
      if (gameLevel === 2) {
        grid.classList.add("expert");
      }
      if (gameLevel === 3) {
        grid.classList.add("pro");
      }
      grid.appendChild(square);

      const cell = newBoard[rowIndex][colIndex];
      const cellElement = document.querySelector(
        `[data-row="${rowIndex}"][data-col="${colIndex}"]`
      );

      if (isGameOver && cell.isMine) {
        square.innerHTML = "💣";
        square.classList.add("mine");
      }

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

function chooseGameLevel(level) {
  gameLevel = level;
  if (level == 0) {
    rows = 8;
    columns = 8;
    numMines = 10;
  }
  if (level == 1) {
    rows = 10;
    columns = 10;
    numMines = 15;
  }
  if (level == 2) {
    rows = 12;
    columns = 12;
    numMines = 30;
  }
  if (level == 3) {
    rows = 16;
    columns = 16;
    numMines = 80;
  }
  hideChooseGameLevelScreen();
  startNewGame();
}

function addChooseGameLevelEvents() {
  document.getElementById('game-level-beginner').addEventListener('click', function () {
    chooseGameLevel(0)
  })
  document.getElementById('game-level-intermediate').addEventListener('click', function () {
    chooseGameLevel(1)
  })
  document.getElementById('game-level-expert').addEventListener('click', function () {
    chooseGameLevel(2)
  })
  document.getElementById('game-level-pro').addEventListener('click', function () {
    chooseGameLevel(3)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  // Init event
  addChooseGameLevelEvents();

  // Game logic
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
      hideGameOverScreen();
      showChooseGameLevelScreen();
    }
  }
});
