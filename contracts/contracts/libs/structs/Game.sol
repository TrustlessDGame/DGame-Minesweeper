pragma solidity ^0.8.0;

library GameData {
    event GameInit(uint256 gameId);
    event GameMove(uint256 gameId, GameResult result);
    event GameFlag(uint256 gameId, uint256 row, uint256 col, bool flag);
    event GameFinish(address player, uint256 score);

    enum GameResult {
        PLAYING, WIN, LOSE, FINISH
    }

    struct Game {
        address _player;
        uint256 _numberMines;
        uint256 _start;
        uint256 _lastMove;
        uint256 _countMove;
        BoardStateCell[16][16] _boardState;
        GameResult _result;
        GameLevel _level;
    }

    struct BoardStateCell {
        bool _isMine;
        uint8 _adjacentMines;
        bool _isRevealed;
        bool _isFlagged;
    }

    struct BoardStateCellMove {
        uint8 _adjacentMines;
        bool _isRevealed;
    }

    struct GameLevel {
        uint256 rows;
        uint256 cols;
        uint256 numMine;
        uint256 baseScore;
        uint256 totalMove;
        uint256 maxTime;
        uint256 minMoves;
    }
}
