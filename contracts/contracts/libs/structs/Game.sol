pragma solidity ^0.8.0;

library GameData {
    event GameInit(uint256 gameId);
    event GameMove(uint256 gameId, GameResult result);

    enum GameResult {
        PLAYING, WIN, LOSE
    }

    struct Game {
        address _player;
        uint256 _level;
        uint256 _numberMines;
        uint256 _start;
        uint256 _lastMove;
        BoardStateCell[][] _boardState;
        GameResult _result;
    }

    struct BoardStateCell {
        bool _isMine;
        uint256 _adjacentMines;
        bool _isRevealed;
        bool _isFlagged;
    }
}
