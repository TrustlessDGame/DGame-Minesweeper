// YOUR_ASSETS
const GAME_ASSETS = {
  asset_music: "./assets/game-music.mid"
};
// YOUR GAME CONTRACT ABI JSON INTERFACE
const GAME_CONTRACT_ABI_INTERFACE_JSON = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "level",
        type: "uint256",
      },
    ],
    name: "InitGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "row",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "col",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bool",
            name: "_isMine",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "_adjacentMines",
            type: "uint8",
          },
          {
            internalType: "bool",
            name: "_isRevealed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "_isFlagged",
            type: "bool",
          },
        ],
        internalType: "struct GameData.BoardStateCell[][]",
        name: "nextBoardState",
        type: "tuple[][]",
      },
    ],
    name: "Move",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "_admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_currentGameId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_erc20Token",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_games",
    outputs: [
      {
        internalType: "address",
        name: "_player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_numberMines",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_lastMove",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_countMove",
        type: "uint256",
      },
      {
        internalType: "enum GameData.GameResult",
        name: "_result",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "rows",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cols",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "numMine",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalMove",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTime",
            type: "uint256",
          },
        ],
        internalType: "struct GameData.GameLevel",
        name: "_level",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_leaderboard",
    outputs: [
      {
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_paramsAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "rows",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cols",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "numMine",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalMove",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxTime",
            type: "uint256",
          },
        ],
        internalType: "struct GameData.GameLevel",
        name: "gameLevel",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "num_moves",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "elapsed_time",
        type: "uint256",
      },
    ],
    name: "calculateScore",
    outputs: [
      {
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdm",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAddr",
        type: "address",
      },
    ],
    name: "changeERC20Token",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAddr",
        type: "address",
      },
    ],
    name: "changeParam",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "address",
        name: "paramAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "erc20Token",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
