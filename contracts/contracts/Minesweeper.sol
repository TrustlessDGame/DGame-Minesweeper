pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "./libs/helpers/Errors.sol";
import "./libs/structs/Game.sol";

contract Minesweeper is Initializable, ReentrancyGuardUpgradeable, OwnableUpgradeable {

    address public _admin;
    address public _paramsAddress;
    address public _erc20Token;

    mapping(uint256 => GameData.Game) public _games;
    uint256 public _currentGameId;

    function initialize(
        address admin,
        address paramAddress,
        address erc20Token
    ) initializer public {
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

    function getGameLevel(uint256 level) internal returns (uint256 rows, uint256 columns, uint256 numMines) {
        require(level == 0 || level == 1 || level == 2 || level == 3);
        if (level == 0) {
            rows = 8;
            columns = 8;
            numMines = 10;
        }
        else if (level == 1) {
            rows = 10;
            columns = 10;
            numMines = 15;
        }
        else if (level == 2) {
            rows = 12;
            columns = 12;
            numMines = 30;
        }
        else {
            rows = 16;
            columns = 16;
            numMines = 80;
        }
    }

    function InitGame(uint256 level) public {
        _currentGameId++;

        _games[_currentGameId]._level = level;
        (uint256 rows, uint256 cols, uint256 numberMines) = getGameLevel(level);
        _games[_currentGameId]._numberMines = numberMines;
        _games[_currentGameId]._player = msg.sender;
        _games[_currentGameId]._start = block.number;
        _games[_currentGameId]._result = GameData.GameResult.PLAYING;

        emit GameData.GameInit(_currentGameId);
    }

    function Move(uint256 gameId, uint256 row, uint256 col, GameData.BoardStateCell[][] memory boardState) public {
        GameData.Game memory game = _games[gameId];
        require(game._player == msg.sender, "M1");
        require(game._result == GameData.GameResult.PLAYING);

        (uint256 rows, uint256 cols, uint256 numberMines) = getGameLevel(game._level);

        require(verify(gameId));

        for (uint256 i; i < rows; i++) {
            for (uint256 j; j < cols; j++) {
                _games[gameId]._boardState[i][j]._adjacentMines = boardState[i][j]._adjacentMines;
                _games[gameId]._boardState[i][j]._isFlagged = boardState[i][j]._isFlagged;
                _games[gameId]._boardState[i][j]._isMine = boardState[i][j]._isMine;
                _games[gameId]._boardState[i][j]._isRevealed = boardState[i][j]._isRevealed;
            }
        }

        _games[gameId]._lastMove = block.number;
        _games[gameId]._result = checkResult(gameId);

        emit GameData.GameMove(gameId, _games[gameId]._result);
    }

    function verify(uint256 gameId) internal returns (bool) {
        return true;
    }

    function checkResult(uint256 gameId) internal returns (GameData.GameResult) {
        return GameData.GameResult.PLAYING;
    }
}
