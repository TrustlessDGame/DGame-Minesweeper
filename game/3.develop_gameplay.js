window.callBackLoadResourcesComplete = () => {
  console.log("Complete load resources", GAME_ASSETS);
  injectFonts();
  // injectGame();
};

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
let placeMineList = [];
let gameId = 0;
let factor = 1;

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

async function Move(row, col, boardState) {
  const hideMineBoardState = boardState.map((rows) => {
    return rows.map((square) => {
      return {
        _adjacentMines: square._adjacentMines,
        _isRevealed: square._isRevealed,
      };
    });
  });

  const cell = boardState[row][col];

  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    null,
    0,
    null,
    "Move(uint256, uint8, uint8, bool, (uint8,bool)[][])",
    gameId,
    row,
    col,
    cell._isMine,
    JSON.parse(JSON.stringify(hideMineBoardState))
  );
}

async function Flag(row, col, isFlag) {
  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    null,
    0,
    null,
    "Flag(uint256, uint8, uint8, bool)",
    gameId,
    row,
    col,
    isFlag
  );
}

async function CheckFinish(finalBoardState) {
  return await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    null,
    0,
    null,
    "CheckFinish(uint256, (bool,uint8,bool,bool)[][])",
    gameId,
    finalBoardState
  );
}

async function GetLeaderboard(index) {
  const data = await contractInteraction.Call(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    "_leaderboard(uint256)",
    index
  );
  return data;
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
        _isMine: false,
        _adjacentMines: 0,
        _isRevealed: false,
        _isFlagged: false,
      };
    }
  }

  // Randomly place mines on the board
  let placedMines = 0;
  while (placedMines < numMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);

    placeMineList.push({
      x: row,
      y: col,
    });
    if (!board[row][col]._isMine) {
      board[row][col]._isMine = true;
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
          board[i][j]._adjacentMines++;
        }
      }
    }
  }
  return board;
}

function setImageAsset(parentEl, src) {
  const firstChild = parentEl.firstElementChild;

  if(firstChild) {
    parentEl.removeChild(firstChild);
  }

  const imgElement = document.createElement("img");

  imgElement.src = src;
  imgElement.alt = "game asset image";
  parentEl.appendChild(imgElement);
}

function showChooseGameLevelScreen() {
  document.getElementById("grid").style = "block";
  document.getElementById("flag-info").style.display = "none";

  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = "block";

  document.querySelector("#go-to-leaderboard").style.display = "block";

  const speakerOn = document.querySelector("#speaker-on");
  const speakerOff = document.querySelector("#speaker-off");
  speakerOn.style.display = "none";
  speakerOff.style.display = "none";
  document.querySelector("#game-audio").pause();
}

function hideChooseGameLevelScreen() {
  const gameOverScreen = document.getElementById("game-level");
  gameOverScreen.style.display = "none";
  document.getElementById("flag-info").style.display = "block";
  document.querySelector("#go-to-leaderboard").style.display = "none";
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

async function validatingGameWinScreen() {
  const res = await CheckFinish(board);
  if (res) {
    return true;
  }
  return false;
}

function showGameWinScreen() {
  document.querySelector("#game-validate").style.display = "none";
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

function hideGameValidateScreen() {
  document.querySelector("#game-validate").style.display = "none";
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
      if (!cell._isMine && !cell._isRevealed) {
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

function triggerGameOver() {
  const firstMine = placeMineList[0];
  const mineCellElement = document.querySelector(
    `[data-row="${firstMine.x}"][data-col="${firstMine.y}"]`
  );
  mineCellElement.click();
}

// Function to reveal a cell
async function revealCell(board, row, col) {
  const cell = board[row][col];
  const flagsLeft = document.querySelector("#flags-left");

  if (!cell._isRevealed) {
    cell._isRevealed = true;

    // If the cell is flagged
    if (cell._isFlagged) {
      cell._isFlagged = false;
      flags--;
      flagsLeft.innerHTML = numMines - flags;
    }

    // If the cell is a mine, the game is over
    if (cell._isMine) {
      // Implement game over logic here
      gameStatus = -1;
      showGameOverScreen(board);
      stopPlayingTime();
      return;
    }

    // If the cell has no adjacent mines, recursively reveal neighboring cells
    if (cell._adjacentMines === 0) {
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

function drawBoard(newBoard, isGameOver = false) {
  // Code to redraw the board

  const processingElement = document.getElementById("processing");

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

      if (cell._isFlagged) {
        square.classList.add("flag");
        square.innerHTML = " 🚩";
      }

      // Open to reveal all bomb at start
      if (cell._isMine && isGameOver) {
        square.innerHTML = "💣";
        square.classList.add("mine");
        return;
      }

      if (cell._isRevealed) {
        if (cell._isMine) {
          square.innerHTML = "💣";
          square.classList.add("mine");
        } else if (cell._adjacentMines > 0) {
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
          square.classList.add(`${classNumber[cell._adjacentMines]}`);
          square.classList.add("checked");
          square.innerHTML = cell._adjacentMines;
          flagsLeft.innerHTML = numMines - flags;
        } else {
          square.classList.add("checked");
        }
      }

      cellElement.addEventListener("click", async function (e) {
        e.preventDefault();
        processingElement.style.display = "grid";
        clickCount += 1;

        if (cell._isFlagged) {
          addFlag(cellElement, cell);
          try {
            const res = await Flag(rowIndex, colIndex, cell._isFlagged);
            if (res && res.receipt.logs[0].data) {
              drawBoard(newBoard);
            }
          } catch (err) {
            console.log("Something wrong, please try again.");
          } finally {
            processingElement.style.display = "none";
          }
          return;
        }

        revealCell(board, rowIndex, colIndex);

        try {



          const res = await Move(rowIndex, colIndex, newBoard);
          if (res && res.receipt.logs[0].data && gameStatus !== -1) {
            drawBoard(newBoard);
            if (checkForWin()) {
              document.querySelector("#game-validate").style.display = "block";
              document.querySelector("#processing").style.display = "none";
              const gameValid = await validatingGameWinScreen();
              if (gameValid) {
                document.querySelector("#game-validate").style.display = "none";
                gameStatus = 2; // 0 = Pending, 1 = Playing, -1 = Game Over, 2 Game won
                showGameWinScreen();
              } else {
                gameStatus = -1;
                const validateDesc = document.querySelector(
                  "#game-result-validate-1"
                );
                validateDesc.innerHTML =
                  "Something went wrong when validating game result.";
                validateDesc.style.display = "block";
                const validateBtn = document.querySelector(
                  "#play-again-button-validate"
                );
                validateBtn.style.display = "block";
              }
            }
          }
        } catch (err) {
          console.log("Something wrong, please try again.");
        } finally {
          processingElement.style.display = "none";
        }
      });

      cellElement.addEventListener("contextmenu", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        processingElement.style.display = "grid";
        addFlag(cellElement, cell);
        clickCount += 1;

        // drawBoard(newBoard);
        // processingElement.style.display = "none";

        try {
          const res = await Flag(rowIndex, colIndex, cell._isFlagged);
          if (res && res.receipt.logs[0].data) {
            drawBoard(newBoard);
          }
        } catch (err) {
          console.log("Something wrong, please try again.");
        } finally {
          processingElement.style.display = "none";
        }
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
      cell._isFlagged = true;
      flagsLeft.innerHTML = numMines - flags;
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
      cell._isFlagged = false;
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
  const processingElement = document.getElementById("processing");
  processingElement.style.display = "grid";

  gameLevel = level;
  flags = 0;
  if (level == 0) {
    rows = 8;
    columns = 8;
    numMines = 10;
    maxTime = 500;
    totalMove = 54;
    factor = 5;
  }
  if (level == 1) {
    rows = 10;
    columns = 10;
    numMines = 15;
    maxTime = 780;
    totalMove = 85;
    factor = 10;
  }
  if (level == 2) {
    rows = 12;
    columns = 12;
    numMines = 30;
    maxTime = 1125;
    totalMove = 114;
    factor = 15;
  }
  if (level == 3) {
    rows = 16;
    columns = 16;
    numMines = 80;
    maxTime = 1700;
    totalMove = 176;
    factor = 20;
  }
  flagsLeft.innerHTML = numMines;
  // hideChooseGameLevelScreen();
  // startNewGame();
  // injectGameMusic(GAME_ASSETS["minesweeper_music"]);

  try {
    const { receipt } = await InitGame(level);

    if (receipt && receipt.logs[0].data) {
      const gameData = receipt.logs[0].data.substring(2);

      gameId = parseInt(gameData, 16);

      hideChooseGameLevelScreen();
      startNewGame();
      injectGameMusic(GAME_ASSETS["minesweeper_music"]);
      flagsLeft.innerHTML = numMines;
    }
  } catch (err) {
  } finally {
    processingElement.style.display = "none";
  }

  processingElement.style.display = "none";
}

async function getLeaderBoardData() {
  const leaderboardDataPromises = [...Array(10)].map(async (_, index) => {
    const data = await GetLeaderboard(index);
    if (data.score.toString() !== "0") {
      return { data, index };
    }
    return null;
  });
  const leaderboardData = await Promise.all(leaderboardDataPromises);

  leaderboardData
    .filter((item) => item !== null)
    .sort((a, b) => a.index - b.index)
    .forEach(({ data, index }) => {
      renderTableItem(data, index);
    });
}

function renderTableItem(item, index) {

  const isUserWallet = contractInteraction.WalletData.Wallet.address === item.player;


  const leaderboardTableEl = document.querySelector(".leaderboard_table_data");

  const medalClass = index < 3 ? "--medal" : "";

  const yourWalletClass = isUserWallet ? "--your-wallet" : "";

  const rank =
    index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1;

  const leaderboardDataRowEl = document.createElement("div");
  leaderboardDataRowEl.className = `leaderboard_table_data_row ${yourWalletClass}`;
  leaderboardDataRowEl.innerHTML = `
    <div class="leaderboard_table_data_rank ${medalClass}">${rank}</div>
    <div class="leaderboard_table_data_name">${formatAddress(item.player)} ${isUserWallet ? '(You)' : ''}  </div>
    <div class="leaderboard_table_data_time">${item.score.toString()}</div>
    `;

  leaderboardTableEl.appendChild(leaderboardDataRowEl);
}

function addChooseGameLevelEvents() {
  document
    .getElementById("game-level-beginner")
    .addEventListener("click", function (e) {
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

  //Show leaderboard
  const viewLeaderboardEl = document.getElementById("go-to-leaderboard");

  viewLeaderboardEl.addEventListener("click", function (e) {
    document.querySelector(".leaderboard").style.display = "block";
    const leaderboardDataRows = document.querySelectorAll(
      ".leaderboard_table_data_row"
    );
    leaderboardDataRows.forEach((row) => {
      row.remove();
    });
    getLeaderBoardData();
  });

  // Back to choose level screen

  document.querySelector("#back-btn").addEventListener("click", function (e) {
    document.querySelector(".leaderboard").style.display = "none";
  });
}

function restartGame() {
  if (gameStatus === -1 || gameStatus === 2) {
    hideGameOverScreen();
    hideGameWinScreen();
    hideGameValidateScreen();
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

  document
    .getElementById("play-again-button-validate")
    .addEventListener("click", function () {
      restartGame();
    });
}

function injectFonts() {
  // Create a new style element
  const style = document.createElement("style");

  // Define the @font-face rule as a CSS string
  const fontFaceRule = `
    @font-face {
      font-family: "LilitaOne";
      src: url(${GAME_ASSETS["font_1"]});
      font-weight: normal;
      font-style: normal;ƒ
    }
`;

  // Set the innerHTML of the style element to the @font-face rule
  style.innerHTML = fontFaceRule;

  // Append the style element to the document head
  document.head.appendChild(style);
}

function injectGameMusic(file) {
  // Create a new anchor element
  const playMusic = document.querySelector("#play-music");
  const gameAudio = document.querySelector("#game-audio");
  gameAudio.src = file;
  gameAudio.play();
  const speakerOn = document.querySelector("#speaker-on");
  speakerOn.style.display = "block";
  const speakerOff = document.querySelector("#speaker-off");

  setImageAsset(speakerOn, GAME_ASSETS["speaker_on_1"]);
  setImageAsset(speakerOff, GAME_ASSETS["speaker_off_1"]);

  playMusic.addEventListener("click", function (e) {
    if (playMusic.getAttribute("data-playing") === "0") {
      gameAudio.pause();
      playMusic.setAttribute("data-playing", "1");
      speakerOn.style.display = "none";
      speakerOff.style.display = "block";
    } else {
      playMusic.setAttribute("data-playing", "0");
      gameAudio.play();
      speakerOff.style.display = "none";
      speakerOn.style.display = "block";
    }
  });
}

function importGame() {
  const container = document.createElement("div");
  container.className.add = "game-wrapper";

  container.innerHTML = `
  <div class="container">
      <div id="game-level">
        <div class="backdrop">
          <p class="choose-level-title">Choose your level</p>
          <ul class="game-level-list">
            <li id="game-level-beginner" class="game-level-item beginner">
              Beginner
            </li>
            <li
              id="game-level-intermediate"
              class="game-level-item intermediate"
            >
              Intermediate
            </li>
            <li id="game-level-expert" class="game-level-item expert">
              Expert
            </li>
            <li id="game-level-pro" class="game-level-item pro">
              Mission Impossible
            </li>
          </ul>
        </div>
      </div>
      <div id="grid"></div>
      <div id="flag-info">Flags left: <span id="flags-left"></span></div>
      <div id="game-over">
        <div class="backdrop">
          <div class="content">
            <p class="game-over-title">Game Over</p>
            <button id="play-again-button-over" class="play-again-button">
              Play again
            </button>
          </div>
        </div>
      </div>
      <div id="game-validate">
        <div class="backdrop">
          <div class="content">
            <p class="game-validate-title">Validate game result</p>
            <p id="game-result-validate-1" class="game-result-desc"></p>
            <button id="play-again-button-validate" class="play-again-button">
              Play again
            </button>
            <div class="lds-dual-ring"></div>
          </div>
        </div>
      </div>
      <div id="game-result">
        <div class="backdrop">
          <div class="content">
            <p class="game-result-title">Congratulation!</p>
            <p id="game-result-move" class="game-result-desc"></p>
            <p id="game-result-time" class="game-result-desc"></p>
            <button id="play-again-button-win" class="play-again-button">
              Play again
            </button>
          </div>
        </div>
      </div>
      <div id="game-music"></div>
      <div id="processing" class="lds-dual-ring"></div>
      <a href="#" id="play-music" data-playing="0">
        <p><span id="speaker-on" class="speaker -on"></span></p>
        <p><span id="speaker-off" class="speaker -off"></span></p>
      </a>
      <div id="go-to-leaderboard">
      <div class="cup-icon">🏆</div>
      <div class="leaderboard_title">Leaderboard</div>
      </div>
      <div class="leaderboard"> 
        <div class="leaderboard_heading">
          <div class="cup-icon">🏆</div>
          <div class="leaderboard_title">Leaderboard</div>
        </div>
        <div class="leaderboard_table_wrapper">
          <div class="leaderboard_table">
            <div class="leaderboard_table_heading">
              <div class="leaderboard_table_heading_rank">Rank</div>
              <div class="leaderboard_table_heading_name">Address</div>
              <div class="leaderboard_table_heading_time">Points</div>
            </div>
            <div class="leaderboard_table_data">
     
             </div>
          </div>
        </div>
        <div id='back-btn'>Back</div>
      </div>
      <audio id='game-audio' src='#' loop></audio>
    </div>
  `;
  document.body.appendChild(container);

  // Init event
  addChooseGameLevelEvents();
  addNewGameEvents();
}

importGame();

document.addEventListener("DOMContentLoaded", () => {
  // Check has walletData in local storage
  if (localStorage.getItem(`${NAME_KEY}_${GAME_ID}`)) {
    drawBoard(board);
  }
});

window.onbeforeunload = function (event) {
  triggerGameOver();
};
