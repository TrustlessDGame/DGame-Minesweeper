pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./libs/helpers/Errors.sol";
import "./libs/structs/Game.sol";
import "./libs/structs/LeaderBoard.sol";

contract Minesweeper is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {

    address public _admin;
    address public _paramsAddress;
    address public _erc20Token;

    mapping(uint256 => GameData.Game) public _games;
    uint256 public _currentGameId;

    // lists top 10 users
    uint256 private _leaderboardLength;
    // create an array of Users
    mapping(uint => LeaderBoardData.Player) public _leaderboard;

    function initialize(
        address admin,
        address paramAddress,
        address erc20Token
    ) initializer public {
        _leaderboardLength = 10;
        _admin = admin;
        _paramsAddress = paramAddress;
        _erc20Token = erc20Token;

        __ReentrancyGuard_init();
        __Ownable_init();
    }

    function changeAdmin(address newAdm) external {
        require(msg.sender == _admin && newAdm != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_admin != newAdm) {
            _admin = newAdm;
        }
    }

    function changeParam(address newAddr) external {
        require(msg.sender == _admin && newAddr != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_paramsAddress != newAddr) {
            _paramsAddress = newAddr;
        }
    }

    function changeERC20Token(address newAddr) external {
        require(msg.sender == _admin && newAddr != Errors.ZERO_ADDR, Errors.ONLY_ADMIN_ALLOWED);

        if (_erc20Token != newAddr) {
            _erc20Token = newAddr;
        }
    }

    /*function getGameBoardState(uint256 gameId) public returns (GameData.BoardStateCell[16][16] memory) {
        return _games[gameId]._boardState;
    }*/

    function getGameLevel(uint256 level) internal returns (GameData.GameLevel memory gameLevel) {
        require(level == 0 || level == 1 || level == 2 || level == 3);
        if (level == 0) {
            gameLevel.rows = 8;
            gameLevel.cols = 8;
            gameLevel.numMine = 10;
            gameLevel.totalMove = 54;
            gameLevel.maxTime = 500;
            gameLevel.factor = 1;
        }
        else if (level == 1) {
            gameLevel.rows = 10;
            gameLevel.cols = 10;
            gameLevel.numMine = 15;
            gameLevel.totalMove = 85;
            gameLevel.maxTime = 780;
            gameLevel.factor = 2;
        }
        else if (level == 2) {
            gameLevel.rows = 12;
            gameLevel.cols = 12;
            gameLevel.numMine = 30;
            gameLevel.totalMove = 114;
            gameLevel.maxTime = 1125;
            gameLevel.factor = 3;
        }
        else {
            gameLevel.rows = 16;
            gameLevel.cols = 16;
            gameLevel.numMine = 80;
            gameLevel.totalMove = 176;
            gameLevel.maxTime = 1700;
            gameLevel.factor = 4;
        }
    }

    function InitGame(uint256 level) public {
        _currentGameId++;

        GameData.GameLevel memory gameLevel = getGameLevel(level);
        _games[_currentGameId]._level = gameLevel;
        _games[_currentGameId]._numberMines = gameLevel.numMine;
        _games[_currentGameId]._player = msg.sender;
        _games[_currentGameId]._start = block.number;
        _games[_currentGameId]._result = GameData.GameResult.PLAYING;

        emit GameData.GameInit(_currentGameId);
    }

    function Flag(uint256 gameId, uint8 row, uint8 col, bool flag) public {
        GameData.Game memory game = _games[gameId];

        require(game._player == msg.sender, "M1");
        require(game._result == GameData.GameResult.PLAYING, "M1_1");
        require(game._start > 0, "M1_2");

        _games[gameId]._boardState[row][col]._isFlagged = flag;
        emit GameData.GameFlag(gameId, row, col, flag);
    }

    function Move(uint256 gameId, uint8 row, uint8 col, bool isMined, GameData.BoardStateCell[][] memory nextBoardState) public {
        GameData.Game memory game = _games[gameId];

        require(game._player == msg.sender, "M1");
        require(game._result == GameData.GameResult.PLAYING, "M1_1");
        require(game._start > 0, "M1_2");

        GameData.GameLevel memory gameLevel = game._level;

        for (uint256 i; i < gameLevel.rows; i++) {
            for (uint256 j; j < gameLevel.cols; j++) {
                _games[gameId]._boardState[i][j]._adjacentMines = nextBoardState[i][j]._adjacentMines;
                _games[gameId]._boardState[i][j]._isFlagged = nextBoardState[i][j]._isFlagged;
                _games[gameId]._boardState[i][j]._isRevealed = nextBoardState[i][j]._isRevealed;
            }
        }

        _games[gameId]._lastMove = block.number;
        _games[gameId]._countMove ++;


        (GameData.GameResult result, uint256 countIsReveal) = checkResult(gameId, row, col, isMined);
        _games[gameId]._result = result;
        if (_games[gameId]._result == GameData.GameResult.WIN) {
            require(countIsReveal >= (gameLevel.cols * gameLevel.rows - gameLevel.numMine), "M3");
        } else {
            _games[gameId]._boardState[row][col]._isMine = isMined;
        }

        emit GameData.GameMove(gameId, _games[gameId]._result);
    }

    function CheckFinish(uint256 gameId, GameData.BoardStateCell[][] memory finalBoardState) public {
        require(_games[gameId]._result == GameData.GameResult.WIN);
        GameData.Game memory game = _games[gameId];
        GameData.GameLevel memory gameLevel = game._level;

        uint256 count;
        for (uint256 i; i < gameLevel.rows; i++) {
            for (uint256 j; j < gameLevel.cols; j++) {
                if (!game._boardState[i][j]._isRevealed && finalBoardState[i][j]._isMine) {
                    count++;
                }
            }
        }
        require(count == gameLevel.numMine, "M4");
        uint256 elapsed_time = _games[gameId]._lastMove - _games[gameId]._start;
        uint256 score = calculateScore(_games[gameId]._level, _games[gameId]._countMove, elapsed_time);
        addScore(game._player, score);
    }

    function getNextBoardState(GameData.BoardStateCell[16][16] memory currentBoard, uint256 row, uint256 col, GameData.GameLevel memory level) internal view returns (GameData.BoardStateCell[16][16] memory) {
        GameData.BoardStateCell[16][16] memory nextBoardState = currentBoard;
        GameData.BoardStateCell memory cell = nextBoardState[row][col];

        if (!cell._isRevealed) {
            cell._isRevealed = true;

            // If the cell is flagged
            if (cell._isFlagged) {
                cell._isFlagged = false;
            }

            if (cell._adjacentMines == 0) {
                for (uint256 i = row - 1; i <= row + 1; i++) {
                    for (uint256 j = col - 1; j <= col + 1; j++) {
                        if (
                            i >= 0 &&
                            i < level.rows &&
                            j >= 0 &&
                            j < level.cols
                        ) {
                            getNextBoardState(nextBoardState, i, j, level);
                        }
                    }
                }
            }
        }
        return nextBoardState;
    }

    function checkResult(uint256 gameId, uint256 row, uint col, bool isMined) internal returns (GameData.GameResult gameResult, uint256 countIsRevealed) {
        GameData.Game memory game = _games[gameId];
        GameData.BoardStateCell[16][16] memory currentGameStates = game._boardState;

        GameData.GameLevel memory gameLevel = game._level;
        uint256 count;
        countIsRevealed = 0;
        for (uint256 i; i < gameLevel.rows; i++) {
            for (uint256 j; j < gameLevel.cols; j++) {
                if (_games[gameId]._boardState[i][j]._isRevealed) {
                    countIsRevealed++;
                }
                if (_games[gameId]._boardState[i][j]._isRevealed && i == row && j == col && isMined) {
                    gameResult = GameData.GameResult.LOSE;
                    return (gameResult, 0);
                } else {
                    if (!_games[gameId]._boardState[i][j]._isRevealed) {
                        count++;
                    }
                }
            }
        }
        if (count == gameLevel.numMine) {
            gameResult = GameData.GameResult.WIN;
        } else {
            gameResult = GameData.GameResult.PLAYING;
        }
    }

    function calculateScore(GameData.GameLevel memory gameLevel, uint256 num_moves, uint256 elapsed_time) public returns (uint256 score) {
        uint256 move_score = 0;
        if (num_moves < gameLevel.totalMove) {
            move_score = 500 * gameLevel.totalMove / num_moves;
        }
        uint256 time_score = 0;
        if (elapsed_time < gameLevel.maxTime) {
            time_score = 500 * gameLevel.maxTime / elapsed_time;
        }
        score = gameLevel.factor * (move_score + time_score);
    }

    function addScore(address user, uint score) internal returns (bool) {
        // if the score is too low, don't update
        if (_leaderboard[_leaderboardLength - 1].score >= score) return false;

        // loop through the leaderboard
        for (uint i = 0; i < _leaderboardLength; i++) {
            // find where to insert the new score
            if (_leaderboard[i].score < score) {

                // shift leaderboard
                LeaderBoardData.Player memory currentUser = _leaderboard[i];
                for (uint j = i + 1; j < _leaderboardLength + 1; j++) {
                    LeaderBoardData.Player memory nextUser = _leaderboard[j];
                    _leaderboard[j] = currentUser;
                    currentUser = nextUser;
                }

                // insert
                _leaderboard[i] = LeaderBoardData.Player({
                player : user,
                score : score
                });

                // delete last from list
                delete _leaderboard[_leaderboardLength];

                return true;
            }
        }
        return false;
    }

    function getGameState(uint256 gameId, uint256 i, uint256 j) public view returns (GameData.BoardStateCell memory) {
        return _games[gameId]._boardState[i][j];
    }
}
