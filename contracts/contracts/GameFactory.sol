// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameState.sol";
import "./PlayerStats.sol";

contract GameFactory {
    struct Lobby {
        uint256 gameId;
        address player1;
        address player2;
        uint256 createdAt;
        bool isPrivate;
        bool isStarted;
        uint256 betAmount;
        bool prizeClaimed;
    }

    GameState public gameState;
    uint256 public gameCounter;
    PlayerStats public playerStats;
    
    mapping(uint256 => Lobby) public lobbies;
    mapping(address => uint256[]) public playerGames;
    uint256[] public openLobbies;

    event LobbyCreated(uint256 indexed gameId, address indexed creator, bool isPrivate, uint256 betAmount);
    event PlayerJoined(uint256 indexed gameId, address indexed player);
    event GameStarted(uint256 indexed gameId, address player1, address player2);
    event WinningsClaimed(uint256 indexed gameId, address indexed winner, uint256 amount);

    constructor() {
        gameState = new GameState(); 
        gameState.setFactory(address(this)); 
        playerStats = new PlayerStats(address(this));
    }

    function createLobby(bool isPrivate) external payable returns (uint256) {
        gameCounter++;
        uint256 gameId = gameCounter;
        
        lobbies[gameId] = Lobby({
            gameId: gameId,
            player1: msg.sender,
            player2: address(0),
            createdAt: block.timestamp,
            isPrivate: isPrivate,
            isStarted: false,
            betAmount: msg.value,
            prizeClaimed: false
        });
        
        playerGames[msg.sender].push(gameId);
        
        if (!isPrivate) {
            openLobbies.push(gameId);
        }
        
        emit LobbyCreated(gameId, msg.sender, isPrivate, msg.value);
        return gameId;
    }

    function joinLobby(uint256 gameId) external payable {
        Lobby storage lobby = lobbies[gameId];
        require(lobby.player2 == address(0), "Lobby full");
        require(!lobby.isStarted, "Already started");
        require(msg.sender != lobby.player1, "Cannot join own game");
        require(msg.value == lobby.betAmount, "Wrong bet amount");
        
        lobby.player2 = msg.sender;
        lobby.isStarted = true;
        
        playerGames[msg.sender].push(gameId);
        _removeFromOpenLobbies(gameId);
        
        emit PlayerJoined(gameId, msg.sender);
        emit GameStarted(gameId, lobby.player1, msg.sender);
        
        gameState.initializeGame(gameId, lobby.player1, msg.sender);
    }

    function quickMatch() external payable returns (uint256) {
        if (openLobbies.length == 0) {
            return this.createLobby{value: msg.value}(false);
        }
        
        uint256 gameId = openLobbies[0];
        this.joinLobby{value: msg.value}(gameId);
        return gameId;
    }

    function recordGameEnd(uint256 gameId) external {
        require(msg.sender == address(gameState), "Only GameState");
        
        Lobby storage lobby = lobbies[gameId];
        GameState.Game memory game = gameState.getGame(gameId);
        
        require(game.phase == GameState.GamePhase.Ended, "Game not ended");
        require(game.winner != address(0), "No winner");
        
        address loser = game.winner == lobby.player1 ? lobby.player2 : lobby.player1;
        
        // Record stats (can add damage/kills tracking later)
        playerStats.recordGameResult(game.winner, loser, 0, 0);
    }

    function claimWinnings(uint256 gameId) external {
        Lobby storage lobby = lobbies[gameId];
        GameState.Game memory game = gameState.getGame(gameId);
        
        require(game.phase == GameState.GamePhase.Ended, "Game not ended");
        require(msg.sender == game.winner, "Not winner");
        require(lobby.betAmount > 0, "No bet");
        require(!lobby.prizeClaimed, "Already claimed");
        
        uint256 totalPrize = lobby.betAmount * 2;
        lobby.prizeClaimed = true;
        
        emit WinningsClaimed(gameId, msg.sender, totalPrize);
        
        (bool success, ) = msg.sender.call{value: totalPrize}("");
        require(success, "Transfer failed");
    }

    function cancelLobby(uint256 gameId) external {
        Lobby storage lobby = lobbies[gameId];
        require(msg.sender == lobby.player1, "Not creator");
        require(lobby.player2 == address(0), "Game started");
        require(block.timestamp > lobby.createdAt + 1 hours, "Too early");
        
        uint256 refund = lobby.betAmount;
        lobby.betAmount = 0;
        
        _removeFromOpenLobbies(gameId);
        
        if (refund > 0) {
            (bool success, ) = msg.sender.call{value: refund}("");
            require(success, "Refund failed");
        }
    }

    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }

    function getOpenLobbies() external view returns (uint256[] memory) {
        return openLobbies;
    }

    function _removeFromOpenLobbies(uint256 gameId) internal {
        for (uint256 i = 0; i < openLobbies.length; i++) {
            if (openLobbies[i] == gameId) {
                openLobbies[i] = openLobbies[openLobbies.length - 1];
                openLobbies.pop();
                break;
            }
        }
    }
}