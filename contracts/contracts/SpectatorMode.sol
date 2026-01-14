// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameState.sol";

contract SpectatorMode {
    GameState public gameState;
    
    mapping(uint256 => address[]) public spectators;
    mapping(uint256 => mapping(address => bool)) public isSpectating;
    
    event SpectatorJoined(uint256 indexed gameId, address indexed spectator);
    event SpectatorLeft(uint256 indexed gameId, address indexed spectator);

    constructor(address _gameState) {
        gameState = GameState(_gameState);
    }

    function joinAsSpectator(uint256 gameId) external {
        require(!isSpectating[gameId][msg.sender], "Already spectating");
        
        spectators[gameId].push(msg.sender);
        isSpectating[gameId][msg.sender] = true;
        
        emit SpectatorJoined(gameId, msg.sender);
    }

    function leaveSpectating(uint256 gameId) external {
        require(isSpectating[gameId][msg.sender], "Not spectating");
        
        isSpectating[gameId][msg.sender] = false;
        
        address[] storage specs = spectators[gameId];
        for (uint256 i = 0; i < specs.length; i++) {
            if (specs[i] == msg.sender) {
                specs[i] = specs[specs.length - 1];
                specs.pop();
                break;
            }
        }
        
        emit SpectatorLeft(gameId, msg.sender);
    }

    function getSpectatorCount(uint256 gameId) external view returns (uint256) {
        return spectators[gameId].length;
    }

    function getSpectators(uint256 gameId) external view returns (address[] memory) {
        return spectators[gameId];
    }

    function getGameForSpectator(uint256 gameId) external view returns (
        address player1,
        address player2,
        uint8 currentTurn,
        uint8 phase,
        bool isActive
    ) {
        (
            address p1,
            address p2,
            GameState.GamePhase p,
            uint8 turn,
            ,
            ,
            bool active,
            ,
        ) = gameState.games(gameId);
        
        return (p1, p2, turn, uint8(p), active);
    }
}