// Game play
let rows = 10;
let columns = 10;
let numMines = 10;
let flags = 0;
let board = [];
let gameStatus = 0; // 0 = Pending, 1 = Playing, -1 = Game Over, 2 Game won
let clickCount = 0;
let playingTime = 0; // Seconds
let gameLevel = -1; // 0 = Beginner, 1 = Intermediate, 2 = Export, 3 = Mission Impossible
let intervalId = null;

//// Call Contract

async function InitGame(level) {
  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    null,
    0,
    null,
    "InitGame(uint256)",
    level
  );
}

//// Call Contract

async function InitGame(level) {
  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    null,
    0,
    null,
    "InitGame(uint256)",
    level
  );
}

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
        isFlagged: false,
      };
    }
  }

  // Randomly place mines on the board
  let placedMines = 0;
  let placeMineList = [];
  while (placedMines < numMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);
    placeMineList.push({
      x: row + 1,
      y: col + 1,
    });
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
  document.getElementById("grid").style = "block";
  document.getElementById("flag-info").style.display = "none";

  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = "block";
}

function hideChooseGameLevelScreen() {
  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = "none";
  document.getElementById("flag-info").style.display = "block";
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

function showGameWinScreen() {
  const gameResultScreen = document.getElementById("game-result");
  gameResultScreen.style.display = "block";
  const gameResultMove = document.getElementById("game-result-move");
  gameResultMove.innerHTML = `Click count: ${clickCount}`;
  const gameResultTime = document.getElementById("game-result-time");
  gameResultTime.innerHTML = `Time: ${playingTime}s`;
}

function hideGameWinScreen() {
  const gameResultScreen = document.getElementById("game-result");
  gameResultScreen.style.display = "none";
}

function startPlayingTime() {
  intervalId = setInterval(function () {
    playingTime += 1;
  }, 1000);
}

function stopPlayingTime() {
  if (intervalId) {
    clearInterval(intervalId);
  }
}

function checkForWin() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const cell = board[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false; // Not all non-mine cells are revealed
      }
    }
  }
  return true; // All non-mine cells are revealed
}

function startNewGame() {
  document.getElementById("grid").style.display = "flex";
  board = generateBoard(rows, columns, numMines);
  gameStatus = 1;
  playingTime = 0;
  clickCount = 0;
  startPlayingTime();
  drawBoard(board);
}

// Function to reveal a cell
function revealCell(board, row, col) {
  const cell = board[row][col];
  // debugger;
  const flagsLeft = document.querySelector("#flags-left");

  if (!cell.isRevealed) {
    cell.isRevealed = true;

    // If the cell is flagged
    if (cell.isFlagged) {
      cell.isFlagged = false;
      flags--;
      flagsLeft.innerHTML = numMines - flags;
    }

    // If the cell is a mine, the game is over
    if (cell.isMine) {
      // Implement game over logic here
      gameStatus = -1;
      showGameOverScreen(board);
      stopPlayingTime();
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

    drawBoard(board);

    // Check for win condition
    if (checkForWin()) {
      gameStatus = 2; // Game won
      stopPlayingTime();
      showGameWinScreen();
    }
  }
}

function drawBoard(newBoard, isGameOver = false) {
  // Code to redraw the board
  const grid = document.getElementById("grid");
  grid.classList = "";
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
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  newBoard.forEach((row, rowIndex) => {
    row.forEach((_, colIndex) => {
      const square = document.createElement("div");
      square.setAttribute("data-row", rowIndex);
      square.setAttribute("data-col", colIndex);
      square.classList.add("square");
      grid.appendChild(square);

      const cell = newBoard[rowIndex][colIndex];
      const cellElement = document.querySelector(
        `[data-row="${rowIndex}"][data-col="${colIndex}"]`
      );
      const flagsLeft = document.querySelector("#flags-left");

      if (cell.isFlagged) {
        square.classList.add("flag");
        square.innerHTML = " 🚩";
      }

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
            5: "five",
            6: "six",
            7: "seven",
            8: "eight",
          };
          square.classList.add(`${classNumber[cell.adjacentMines]}`);
          square.classList.add("checked");
          square.innerHTML = cell.adjacentMines;
          flagsLeft.innerHTML = numMines - flags;
        } else {
          square.classList.add("checked");
        }
      }

      cellElement.addEventListener("click", function (e) {
        e.preventDefault();
        clickCount += 1;
        revealCell(board, rowIndex, colIndex);
      });

      cellElement.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e.stopPropagation();
        addFlag(cellElement, cell);
        console.log("🚀 ~ cell:", cell);
      });
    });
  });
}

//add Flag with right click
function addFlag(square, cell) {
  if (gameStatus === -1) return;

  const flagsLeft = document.querySelector("#flags-left");
  if (!square.classList.contains("checked") && flags < numMines) {
    if (!square.classList.contains("flag")) {
      square.classList.add("flag");
      square.innerHTML = " 🚩";
      flags++;
      cell.isFlagged = true;
      flagsLeft.innerHTML = numMines - flags;

      // checkForWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
      cell.isFlagged = false;
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

async function chooseGameLevel(level) {
  const flagsLeft = document.querySelector("#flags-left");
  gameLevel = level;
  flags = 0;
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
  flagsLeft.innerHTML = numMines;

  await InitGame(level);
  hideChooseGameLevelScreen();
  startNewGame();
  flagsLeft.innerHTML = numMines;
}

function addChooseGameLevelEvents() {
  document
    .getElementById("game-level-beginner")
    .addEventListener("click", function () {
      chooseGameLevel(0);
    });
  document
    .getElementById("game-level-intermediate")
    .addEventListener("click", function () {
      chooseGameLevel(1);
    });
  document
    .getElementById("game-level-expert")
    .addEventListener("click", function () {
      chooseGameLevel(2);
    });
  document
    .getElementById("game-level-pro")
    .addEventListener("click", function () {
      chooseGameLevel(3);
    });
}

function restartGame() {
  if (gameStatus === -1 || gameStatus === 2) {
    hideGameOverScreen();
    hideGameWinScreen();
    showChooseGameLevelScreen();
  }
}

function addNewGameEvents() {
  document
    .getElementById("play-again-button-over")
    .addEventListener("click", function () {
      restartGame();
    });

  document
    .getElementById("play-again-button-win")
    .addEventListener("click", function () {
      restartGame();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  MIDIjs.play("./assets/game-music.mid");

  // Check has walletData in local storage
  if (localStorage.getItem(`${NAME_KEY}_${GAME_ID}`)) {
    //Check ongoing game

    // Init event
    addChooseGameLevelEvents();
    addNewGameEvents();

    // Game logic
    drawBoard(board);
  }
});


window.onbeforeunload = function () {
  console.log("user reload");
  return "Are you sure you want to refresh the page?";
};

// CONTRACT FUNCTIONS

async function Move(row, col, boardState) {
  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    0,
    null,
    "Move(uint256, uint256, uint256, tupple[][])",
    level
  );
}
