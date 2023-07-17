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
let random = Math.random,
  cos = Math.cos,
  sin = Math.sin,
  PI = Math.PI,
  PI2 = PI * 2,
  timer = undefined,
  frame = undefined,
  confetti = [];
let particles = 10,
  spread = 40,
  sizeMin = 3,
  sizeMax = 12 - sizeMin,
  eccentricity = 10,
  deviation = 100,
  dxThetaMin = -0.1,
  dxThetaMax = -dxThetaMin - dxThetaMin,
  dyMin = 0.13,
  dyMax = 0.18,
  dThetaMin = 0.4,
  dThetaMax = 0.7 - dThetaMin;
let confettiContainer = document.createElement("div");

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
  showConfetti();
}

function hideGameWinScreen() {
  const gameResultScreen = document.getElementById("game-result");
  gameResultScreen.style.display = "none";
  hideConfetti();
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

  // call contract init game
  await contractInteraction.Send(
    GAME_CONTRACT_ABI_INTERFACE_JSON,
    GAME_CONTRACT_ADDRESS,
    0,
    40000,
    "InitGame(uint256)",
    level
  );

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

document.addEventListener("DOMContentLoaded", () => {
  // Check has walletData in local storage

  if (localStorage.getItem(`${NAME_KEY}_${GAME_ID}`)) {
    // Init event
    addChooseGameLevelEvents();

    // Game logic
    drawBoard(board);
  }

  // for (let row = 0; row < rows; row++) {
  //   for (let col = 0; col < columns; col++) {
  //     const cell = board[row][col];

  //     const cellElement = document.querySelector(
  //       `[data-row="${row}"][data-col="${col}"]`
  //     );

  //     // normal click
  //     cellElement.addEventListener("click", function (e) {
  //       e.preventDefault();
  //       revealCell(board, row, col);
  //     });

  //     // cntrl and left click
  //     cellElement.addEventListener("contextmenu", function (e) {
  //       e.stopPropagation();
  //       e.preventDefault();
  //       addFlag(cellElement, cell);
  //     });
  //   }
  // }
});

function showConfetti() {
  var colorThemes = [
    function () {
      return color(
        (200 * random()) | 0,
        (200 * random()) | 0,
        (200 * random()) | 0
      );
    },
    function () {
      var black = (200 * random()) | 0;
      return color(200, black, black);
    },
    function () {
      var black = (200 * random()) | 0;
      return color(black, 200, black);
    },
    function () {
      var black = (200 * random()) | 0;
      return color(black, black, 200);
    },
    function () {
      return color(200, 100, (200 * random()) | 0);
    },
    function () {
      return color((200 * random()) | 0, 200, 200);
    },
    function () {
      var black = (256 * random()) | 0;
      return color(black, black, black);
    },
    function () {
      return colorThemes[random() < 0.5 ? 1 : 2]();
    },
    function () {
      return colorThemes[random() < 0.5 ? 3 : 5]();
    },
    function () {
      return colorThemes[random() < 0.5 ? 2 : 4]();
    },
  ];
  function color(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  // Cosine interpolation
  function interpolation(a, b, t) {
    return ((1 - cos(PI * t)) / 2) * (b - a) + a;
  }

  // Create a 1D Maximal Poisson Disc over [0, 1]
  var radius = 1 / eccentricity,
    radius2 = radius + radius;
  function createPoisson() {
    // domain is the set of points which are still available to pick from
    // D = union{ [d_i, d_i+1] | i is even }
    var domain = [radius, 1 - radius],
      measure = 1 - radius2,
      spline = [0, 1];
    while (measure) {
      var dart = measure * random(),
        i,
        l,
        interval,
        a,
        b,
        c,
        d;

      // Find where dart lies
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2) {
        (a = domain[i]), (b = domain[i + 1]), (interval = b - a);
        if (dart < measure + interval) {
          spline.push((dart += a - measure));
          break;
        }
        measure += interval;
      }
      (c = dart - radius), (d = dart + radius);

      // Update the domain
      for (i = domain.length - 1; i > 0; i -= 2) {
        (l = i - 1), (a = domain[l]), (b = domain[i]);
        // c---d          c---d  Do nothing
        //   c-----d  c-----d    Move interior
        //   c--------------d    Delete interval
        //         c--d          Split interval
        //       a------b
        if (a >= c && a < d)
          if (b > d) domain[l] = d; // Move interior (Left case)
          else domain.splice(l, 2);
        // Delete interval
        else if (a < c && b > c)
          if (b <= d) domain[i] = c; // Move interior (Right case)
          else domain.splice(i, 0, c, d); // Split interval
      }

      // Re-measure the domain
      for (i = 0, l = domain.length, measure = 0; i < l; i += 2)
        measure += domain[i + 1] - domain[i];
    }

    return spline.sort();
  }

  confettiContainer.style.position = "fixed";
  confettiContainer.style.top = "0";
  confettiContainer.style.left = "0";
  confettiContainer.style.width = "100%";
  confettiContainer.style.height = "0";
  confettiContainer.style.overflow = "visible";
  confettiContainer.style.zIndex = "9999";

  // Confetto constructor
  function Confetto(theme) {
    this.frame = 0;
    this.outer = document.createElement("div");
    this.inner = document.createElement("div");
    this.outer.appendChild(this.inner);

    var outerStyle = this.outer.style,
      innerStyle = this.inner.style;
    outerStyle.position = "absolute";
    outerStyle.width = sizeMin + sizeMax * random() + "px";
    outerStyle.height = sizeMin + sizeMax * random() + "px";
    innerStyle.width = "100%";
    innerStyle.height = "100%";
    innerStyle.backgroundColor = theme();

    outerStyle.perspective = "50px";
    outerStyle.transform = "rotate(" + 360 * random() + "deg)";
    this.axis =
      "rotate3D(" + cos(360 * random()) + "," + cos(360 * random()) + ",0,";
    this.theta = 360 * random();
    this.dTheta = dThetaMin + dThetaMax * random();
    innerStyle.transform = this.axis + this.theta + "deg)";

    this.x = window.innerWidth * random();
    this.y = -deviation;
    this.dx = sin(dxThetaMin + dxThetaMax * random());
    this.dy = dyMin + dyMax * random();
    outerStyle.left = this.x + "px";
    outerStyle.top = this.y + "px";

    // Create the periodic spline
    this.splineX = createPoisson();
    this.splineY = [];
    for (var i = 1, l = this.splineX.length - 1; i < l; ++i)
      this.splineY[i] = deviation * random();
    this.splineY[0] = this.splineY[l] = deviation * random();

    this.update = function (height, delta) {
      this.frame += delta;
      this.x += this.dx * delta;
      this.y += this.dy * delta;
      this.theta += this.dTheta * delta;

      // Compute spline and convert to polar
      var phi = (this.frame % 7777) / 7777,
        i = 0,
        j = 1;
      while (phi >= this.splineX[j]) i = j++;
      var rho = interpolation(
        this.splineY[i],
        this.splineY[j],
        (phi - this.splineX[i]) / (this.splineX[j] - this.splineX[i])
      );
      phi *= PI2;

      outerStyle.left = this.x + rho * cos(phi) + "px";
      outerStyle.top = this.y + rho * sin(phi) + "px";
      innerStyle.transform = this.axis + this.theta + "deg)";
      return this.y > height + deviation;
    };
  }

  function poof() {
    if (!frame) {
      document.body.appendChild(confettiContainer);

      // Add confetti
      var theme = colorThemes[0],
        count = 0;
      (function addConfetto() {
        var confetto = new Confetto(theme);
        confetti.push(confetto);
        confettiContainer.appendChild(confetto.outer);
        timer = setTimeout(addConfetto, spread * random());
      })(0);

      // Start the loop
      var prev = undefined;
      requestAnimationFrame(function loop(timestamp) {
        var delta = prev ? timestamp - prev : 0;
        prev = timestamp;
        var height = window.innerHeight;

        for (var i = confetti.length - 1; i >= 0; --i) {
          if (confetti[i].update(height, delta)) {
            confettiContainer.removeChild(confetti[i].outer);
            confetti.splice(i, 1);
          }
        }

        if (timer || confetti.length)
          return (frame = requestAnimationFrame(loop));

        // Cleanup
        document.body.removeChild(confettiContainer);
        frame = undefined;
      });
    }
  }

  poof();
}

function hideConfetti() {
  clearTimeout(timer);
  confetti = [];
  if (confettiContainer.parentNode) {
    confettiContainer.parentNode.removeChild(confettiContainer);
  }
}

window.addEventListener("keydown", function (event) {
  if (event.key === "x" || event.key === "X") {
    showConfetti();
    if (gameStatus === -1 || gameStatus === 2) {
      hideGameOverScreen();
      hideGameWinScreen();
      showChooseGameLevelScreen();
    }
  }
});

// Usage: Load and play a MIDI file
