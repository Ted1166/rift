// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TurnExecution {
    struct MoveCommit {
        bytes32 moveHash;
        bool committed;
        bool revealed;
    }

    struct PlayerMoves {
        uint8[] unitIds;
        uint8[] actions;
        uint8[] targetX;
        uint8[] targetY;
    }

    address public gameState;
    
    mapping(uint256 => mapping(address => MoveCommit)) public commits;
    mapping(uint256 => mapping(address => PlayerMoves)) moves;

    event MoveCommitted(uint256 indexed gameId, address indexed player, uint8 turn);
    event MoveRevealed(uint256 indexed gameId, address indexed player, uint8 turn);

    modifier onlyGameState() {
        require(msg.sender == gameState, "Only GameState");
        _;
    }

    constructor(address _gameState) {
        gameState = _gameState;
    }

    function commitMove(
        uint256 gameId,
        address player,
        bytes32 moveHash
    ) external onlyGameState {
        require(!commits[gameId][player].committed, "Already committed");
        
        commits[gameId][player] = MoveCommit({
            moveHash: moveHash,
            committed: true,
            revealed: false
        });
        
        emit MoveCommitted(gameId, player, 0);
    }

    function revealMove(
        uint256 gameId,
        address player,
        uint8[] calldata unitIds,
        uint8[] calldata actions,
        uint8[] calldata targetX,
        uint8[] calldata targetY,
        bytes32 salt
    ) external onlyGameState {
        require(commits[gameId][player].committed, "Not committed");
        require(!commits[gameId][player].revealed, "Already revealed");
        
        require(unitIds.length == actions.length, "Length mismatch: actions");
        require(unitIds.length == targetX.length, "Length mismatch: targetX");
        require(unitIds.length == targetY.length, "Length mismatch: targetY");
        require(unitIds.length <= 3, "Too many units"); 
        
        bytes32 computedHash = keccak256(abi.encodePacked(unitIds, actions, targetX, targetY, salt));
        require(computedHash == commits[gameId][player].moveHash, "Invalid reveal");
        
        moves[gameId][player] = PlayerMoves({
            unitIds: unitIds,
            actions: actions,
            targetX: targetX,
            targetY: targetY
        });
        
        commits[gameId][player].revealed = true;
        emit MoveRevealed(gameId, player, 0);
    }

    function bothPlayersCommitted(
        uint256 gameId,
        address player1,
        address player2
    ) external view returns (bool) {
        return commits[gameId][player1].committed && commits[gameId][player2].committed;
    }

    function bothPlayersRevealed(
        uint256 gameId,
        address player1,
        address player2
    ) external view returns (bool) {
        return commits[gameId][player1].revealed && commits[gameId][player2].revealed;
    }

    function getPlayerMoves(
        uint256 gameId,
        address player
    ) external view returns (
        uint8[] memory unitIds,
        uint8[] memory actions,
        uint8[] memory targetX,
        uint8[] memory targetY
    ) {
        PlayerMoves memory playerMoves = moves[gameId][player];
        return (playerMoves.unitIds, playerMoves.actions, playerMoves.targetX, playerMoves.targetY);
    }

    function resetTurn(
        uint256 gameId,
        address player1,
        address player2
    ) external onlyGameState {
        delete commits[gameId][player1];
        delete commits[gameId][player2];
        delete moves[gameId][player1];
        delete moves[gameId][player2];
    }
}