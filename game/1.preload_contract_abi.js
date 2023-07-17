// YOUR GAME PLAY CONTRACT HERE
const GAME_CONTRACT_ABI_INTERFACE_JSON = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint8",
            "name": "version",
            "type": "uint8"
          }
        ],
        "name": "Initialized",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "level",
            "type": "uint256"
          }
        ],
        "name": "InitGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "gameId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "row",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "col",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "bool",
                "name": "_isMine",
                "type": "bool"
              },
              {
                "internalType": "uint256",
                "name": "_adjacentMines",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "_isRevealed",
                "type": "bool"
              },
              {
                "internalType": "bool",
                "name": "_isFlagged",
                "type": "bool"
              }
            ],
            "internalType": "struct GameData.BoardStateCell[][]",
            "name": "nextBoardState",
            "type": "tuple[][]"
          }
        ],
        "name": "Move",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "_admin",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "_currentGameId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "_erc20Token",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "_games",
        "outputs": [
          {
            "internalType": "address",
            "name": "_player",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_level",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_numberMines",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_lastMove",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_countMove",
            "type": "uint256"
          },
          {
            "internalType": "enum GameData.GameResult",
            "name": "_result",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "_leaderboard",
        "outputs": [
          {
            "internalType": "address",
            "name": "player",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "score",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "_paramsAddress",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newAdm",
            "type": "address"
          }
        ],
        "name": "changeAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newAddr",
            "type": "address"
          }
        ],
        "name": "changeERC20Token",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newAddr",
            "type": "address"
          }
        ],
        "name": "changeParam",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "admin",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "paramAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "erc20Token",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }

]



// YOUR GAME PLAY CONTRACT HERE

// DO NOT EDIT
const GAME_TOKEN_ERC20_ABI_INTERFACE_JSON = [{
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "owner", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "spender", "type": "address"
    }, {
        "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"
    }], "name": "Approval", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "from", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "to", "type": "address"
    }, {
        "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"
    }], "name": "Transfer", "type": "event"
}, {
    "inputs": [{
        "internalType": "address", "name": "owner", "type": "address"
    }, {
        "internalType": "address", "name": "spender", "type": "address"
    }], "name": "allowance", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "spender", "type": "address"
    }, {
        "internalType": "uint256", "name": "amount", "type": "uint256"
    }], "name": "approve", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "account", "type": "address"
    }], "name": "balanceOf", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "totalSupply", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "amount", "type": "uint256"
    }], "name": "transfer", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "amount", "type": "uint256"
    }], "name": "transferFrom", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "nonpayable", "type": "function"
}];
const GAME_NFT_ERC721_ABI_INTERFACE_JSON = [{
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "owner", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "approved", "type": "address"
    }, {
        "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "Approval", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "owner", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "operator", "type": "address"
    }, {
        "indexed": false, "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "ApprovalForAll", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"
    }], "name": "Initialized", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "from", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "to", "type": "address"
    }, {
        "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "Transfer", "type": "event"
}, {
    "inputs": [{
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "owner", "type": "address"
    }], "name": "balanceOf", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "getApproved", "outputs": [{
        "internalType": "address", "name": "", "type": "address"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "owner", "type": "address"
    }, {
        "internalType": "address", "name": "operator", "type": "address"
    }], "name": "isApprovedForAll", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "name", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "ownerOf", "outputs": [{
        "internalType": "address", "name": "", "type": "address"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }, {
        "internalType": "bytes", "name": "data", "type": "bytes"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "operator", "type": "address"
    }, {
        "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "bytes4", "name": "interfaceId", "type": "bytes4"
    }], "name": "supportsInterface", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "symbol", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "tokenURI", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}][{
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "owner", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "approved", "type": "address"
    }, {
        "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "Approval", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "owner", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "operator", "type": "address"
    }, {
        "indexed": false, "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "ApprovalForAll", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"
    }], "name": "Initialized", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "from", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "to", "type": "address"
    }, {
        "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "Transfer", "type": "event"
}, {
    "inputs": [{
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "owner", "type": "address"
    }], "name": "balanceOf", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "getApproved", "outputs": [{
        "internalType": "address", "name": "", "type": "address"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "owner", "type": "address"
    }, {
        "internalType": "address", "name": "operator", "type": "address"
    }], "name": "isApprovedForAll", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "name", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "ownerOf", "outputs": [{
        "internalType": "address", "name": "", "type": "address"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }, {
        "internalType": "bytes", "name": "data", "type": "bytes"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "operator", "type": "address"
    }, {
        "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "bytes4", "name": "interfaceId", "type": "bytes4"
    }], "name": "supportsInterface", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "symbol", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "tokenURI", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "tokenId", "type": "uint256"
    }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}];
const GAME_NFT_ERC1155_ABI_INTERFACE_JSON = [{
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "account", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "operator", "type": "address"
    }, {
        "indexed": false, "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "ApprovalForAll", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "operator", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "from", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "to", "type": "address"
    }, {
        "indexed": false, "internalType": "uint256[]", "name": "ids", "type": "uint256[]"
    }, {
        "indexed": false, "internalType": "uint256[]", "name": "values", "type": "uint256[]"
    }], "name": "TransferBatch", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "operator", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "from", "type": "address"
    }, {
        "indexed": true, "internalType": "address", "name": "to", "type": "address"
    }, {
        "indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"
    }, {
        "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"
    }], "name": "TransferSingle", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": false, "internalType": "string", "name": "value", "type": "string"
    }, {
        "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256"
    }], "name": "URI", "type": "event"
}, {
    "inputs": [{
        "internalType": "address", "name": "account", "type": "address"
    }, {
        "internalType": "uint256", "name": "id", "type": "uint256"
    }], "name": "balanceOf", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address[]", "name": "accounts", "type": "address[]"
    }, {
        "internalType": "uint256[]", "name": "ids", "type": "uint256[]"
    }], "name": "balanceOfBatch", "outputs": [{
        "internalType": "uint256[]", "name": "", "type": "uint256[]"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "account", "type": "address"
    }, {
        "internalType": "address", "name": "operator", "type": "address"
    }], "name": "isApprovedForAll", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256[]", "name": "ids", "type": "uint256[]"
    }, {
        "internalType": "uint256[]", "name": "amounts", "type": "uint256[]"
    }, {
        "internalType": "bytes", "name": "data", "type": "bytes"
    }], "name": "safeBatchTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "from", "type": "address"
    }, {
        "internalType": "address", "name": "to", "type": "address"
    }, {
        "internalType": "uint256", "name": "id", "type": "uint256"
    }, {
        "internalType": "uint256", "name": "amount", "type": "uint256"
    }, {
        "internalType": "bytes", "name": "data", "type": "bytes"
    }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "operator", "type": "address"
    }, {
        "internalType": "bool", "name": "approved", "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "bytes4", "name": "interfaceId", "type": "bytes4"
    }], "name": "supportsInterface", "outputs": [{
        "internalType": "bool", "name": "", "type": "bool"
    }], "stateMutability": "view", "type": "function"
}];
BFS_CONTRACTT_ABI_INTERFACE_JSON = [{
    "inputs": [], "name": "FileExists", "type": "error"
}, {
    "inputs": [], "name": "InvalidBfsResult", "type": "error"
}, {
    "inputs": [], "name": "InvalidURI", "type": "error"
}, {
    "anonymous": false, "inputs": [{
        "indexed": true, "internalType": "address", "name": "addr", "type": "address"
    }, {
        "indexed": false, "internalType": "string", "name": "filename", "type": "string"
    }, {
        "indexed": false, "internalType": "uint256", "name": "chunkIndex", "type": "uint256"
    }, {
        "indexed": true, "internalType": "uint256", "name": "bfsId", "type": "uint256"
    }, {
        "indexed": false, "internalType": "string", "name": "uri", "type": "string"
    }], "name": "FileStored", "type": "event"
}, {
    "anonymous": false, "inputs": [{
        "indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"
    }], "name": "Initialized", "type": "event"
}, {
    "inputs": [{
        "internalType": "address", "name": "", "type": "address"
    }, {
        "internalType": "string", "name": "", "type": "string"
    }], "name": "bfsId", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "", "type": "address"
    }, {
        "internalType": "string", "name": "", "type": "string"
    }], "name": "chunks", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "addr", "type": "address"
    }, {
        "internalType": "string", "name": "filename", "type": "string"
    }], "name": "count", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "", "type": "address"
    }, {
        "internalType": "string", "name": "", "type": "string"
    }, {
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "name": "dataStorage", "outputs": [{
        "internalType": "bytes", "name": "", "type": "bytes"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "", "type": "address"
    }, {
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "name": "filenames", "outputs": [{
        "internalType": "string", "name": "", "type": "string"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "getAllAddresses", "outputs": [{
        "internalType": "address[]", "name": "", "type": "address[]"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "addr", "type": "address"
    }], "name": "getAllFilenames", "outputs": [{
        "internalType": "string[]", "name": "", "type": "string[]"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "addr", "type": "address"
    }, {
        "internalType": "string", "name": "filename", "type": "string"
    }], "name": "getId", "outputs": [{
        "internalType": "uint256", "name": "", "type": "uint256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "addr", "type": "address"
    }, {
        "internalType": "string", "name": "filename", "type": "string"
    }, {
        "internalType": "uint256", "name": "chunkIndex", "type": "uint256"
    }], "name": "load", "outputs": [{
        "internalType": "bytes", "name": "", "type": "bytes"
    }, {
        "internalType": "int256", "name": "", "type": "int256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "address", "name": "addr", "type": "address"
    }, {
        "internalType": "string", "name": "filename", "type": "string"
    }], "name": "loadFile", "outputs": [{
        "internalType": "bytes", "name": "", "type": "bytes"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "string", "name": "uri", "type": "string"
    }], "name": "loadFileWithUri", "outputs": [{
        "internalType": "bytes", "name": "", "type": "bytes"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "string", "name": "uri", "type": "string"
    }, {
        "internalType": "uint256", "name": "chunkIndex", "type": "uint256"
    }], "name": "loadWithUri", "outputs": [{
        "internalType": "bytes", "name": "", "type": "bytes"
    }, {
        "internalType": "int256", "name": "", "type": "int256"
    }], "stateMutability": "view", "type": "function"
}, {
    "inputs": [{
        "internalType": "string", "name": "filename", "type": "string"
    }, {
        "internalType": "uint256", "name": "chunkIndex", "type": "uint256"
    }, {
        "internalType": "bytes", "name": "_data", "type": "bytes"
    }], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}]
// DO NOT EDIT