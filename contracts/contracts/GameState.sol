// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Combat.sol";
import "./TurnExecution.sol";

contract GameState {
    enum GamePhase { Deployment, Planning, Revealing, Execution, Ended }
    enum UnitType { Commander, Warrior, Archer }
    
    struct Unit {
        UnitType unitType;
        uint8 x;
        uint8 y;
        uint8 health;
        uint8 attack;
        uint8 defense;
        address owner;
        bool isAlive;
        uint8 id;
    }

    struct Game {
        address player1;
        address player2;
        GamePhase phase;
        uint8 currentTurn;
        address winner;
        uint256 lastActionTime;
        bool isActive;
        uint8 player1UnitsDeployed;
        uint8 player2UnitsDeployed;
    }

    Combat public combat;
    TurnExecution public turnExecution;
    address public factory;
    
    mapping(uint256 => Game) public games;
    mapping(uint256 => mapping(uint8 => Unit)) public units;
    mapping(uint256 => mapping(uint8 => mapping(uint8 => uint8))) public battlefield;
    mapping(uint256 => mapping(uint8 => bool)) public defendingUnits;
    
    uint256 public constant TURN_TIMEOUT = 5 minutes;
    uint256 public constant DEPLOYMENT_TIMEOUT = 10 minutes;

    event GameInitialized(uint256 indexed gameId, address player1, address player2);
    event PhaseChanged(uint256 indexed gameId, GamePhase newPhase);
    event UnitDeployed(uint256 indexed gameId, address indexed player, uint8 unitId, uint8 x, uint8 y);
    event GameEnded(uint256 indexed gameId, address winner);
    event PlayerTimedOut(uint256 indexed gameId, address player, address winner);
    event UnitMoved(uint256 indexed gameId, uint8 unitId, uint8 fromX, uint8 fromY, uint8 toX, uint8 toY);
    event UnitAttacked(uint256 indexed gameId, uint8 attackerId, uint8 targetId, uint8 damage);
    event UnitDefending(uint256 indexed gameId, uint8 unitId);

    modifier onlyPlayer(uint256 gameId) {
        require(
            msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2,
            "Not a player"
        );
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "Only factory");
        _;
    }

    constructor() {
        combat = new Combat();
        turnExecution = new TurnExecution(address(this));
    }

    function setFactory(address _factory) external {
        require(factory == address(0), "Factory already set");
        factory = _factory;
    }

    function initializeGame(uint256 gameId, address player1, address player2) 
        external 
        onlyFactory
    {
        games[gameId] = Game({
            player1: player1,
            player2: player2,
            phase: GamePhase.Deployment,
            currentTurn: 0,
            winner: address(0),
            lastActionTime: block.timestamp,
            isActive: true,
            player1UnitsDeployed: 0,
            player2UnitsDeployed: 0
        });

        emit GameInitialized(gameId, player1, player2);
    }

    function deployUnit(
        uint256 gameId,
        UnitType unitType,
        uint8 x,
        uint8 y
    ) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Deployment, "Not deployment phase");
        require(x < 5 && y < 5, "Out of bounds");
        require(battlefield[gameId][x][y] == 0, "Tile occupied");
        
        bool isPlayer1 = msg.sender == game.player1;
        require(_isValidDeploymentZone(isPlayer1, y), "Invalid zone");
        
        uint8 unitId = isPlayer1 ? game.player1UnitsDeployed : (3 + game.player2UnitsDeployed);
        require(unitId < 6, "Max units deployed");
        
        units[gameId][unitId] = Unit({
            unitType: unitType,
            x: x,
            y: y,
            health: _getUnitHealth(unitType),
            attack: _getUnitAttack(unitType),
            defense: _getUnitDefense(unitType),
            owner: msg.sender,
            isAlive: true,
            id: unitId
        });
        
        battlefield[gameId][x][y] = unitId + 1;
        
        if (isPlayer1) {
            game.player1UnitsDeployed++;
        } else {
            game.player2UnitsDeployed++;
        }
        
        emit UnitDeployed(gameId, msg.sender, unitId, x, y);
        
        if (game.player1UnitsDeployed == 3 && game.player2UnitsDeployed == 3) {
            game.phase = GamePhase.Planning;
            game.lastActionTime = block.timestamp;
            emit PhaseChanged(gameId, GamePhase.Planning);
        }
    }

    function commitMove(uint256 gameId, bytes32 moveHash) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Planning, "Not planning phase");
        
        turnExecution.commitMove(gameId, msg.sender, moveHash);
        game.lastActionTime = block.timestamp;

        if (turnExecution.bothPlayersCommitted(gameId, game.player1, game.player2)) {
            game.phase = GamePhase.Revealing;
            game.lastActionTime = block.timestamp;
            emit PhaseChanged(gameId, GamePhase.Revealing);
        }
    }

    function revealMove(
        uint256 gameId,
        uint8[] calldata unitIds,
        uint8[] calldata actions,
        uint8[] calldata targetX,
        uint8[] calldata targetY,
        bytes32 salt
    ) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.phase == GamePhase.Revealing, "Not revealing phase");
        
        turnExecution.revealMove(gameId, msg.sender, unitIds, actions, targetX, targetY, salt);
        game.lastActionTime = block.timestamp;

        if (turnExecution.bothPlayersRevealed(gameId, game.player1, game.player2)) {
            game.phase = GamePhase.Execution;
            emit PhaseChanged(gameId, GamePhase.Execution);
            _executeTurn(gameId);
        }
    }

    function claimTimeout(uint256 gameId) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.isActive, "Game not active");
        require(block.timestamp > game.lastActionTime + TURN_TIMEOUT, "Timeout not reached");
        
        address winner = msg.sender;
        game.winner = winner;
        game.isActive = false;
        game.phase = GamePhase.Ended;
        
        address loser = msg.sender == game.player1 ? game.player2 : game.player1;
        emit PlayerTimedOut(gameId, loser, winner);
        emit GameEnded(gameId, winner);
    }

    function _executeTurn(uint256 gameId) internal {
        Game storage game = games[gameId];
        
        (uint8[] memory p1UnitIds, uint8[] memory p1Actions, uint8[] memory p1TargetX, uint8[] memory p1TargetY) = 
            turnExecution.getPlayerMoves(gameId, game.player1);
        (uint8[] memory p2UnitIds, uint8[] memory p2Actions, uint8[] memory p2TargetX, uint8[] memory p2TargetY) = 
            turnExecution.getPlayerMoves(gameId, game.player2);
        
        _processDefends(gameId, p1UnitIds, p1Actions);
        _processDefends(gameId, p2UnitIds, p2Actions);
        
        _processMoves(gameId, p1UnitIds, p1Actions, p1TargetX, p1TargetY);
        _processMoves(gameId, p2UnitIds, p2Actions, p2TargetX, p2TargetY);
        
        _processAttacks(gameId, p1UnitIds, p1Actions, p1TargetX, p1TargetY);
        _processAttacks(gameId, p2UnitIds, p2Actions, p2TargetX, p2TargetY);
        
        // Clear defending status
        for (uint256 i = 0; i < 6; i++) { // uint256
            delete defendingUnits[gameId][uint8(i)];
        }
        
        game.currentTurn++;
        turnExecution.resetTurn(gameId, game.player1, game.player2);
        
        if (_checkWinCondition(gameId)) {
            game.phase = GamePhase.Ended;
            game.isActive = false;
            emit GameEnded(gameId, game.winner);
        } else {
            game.phase = GamePhase.Planning;
            game.lastActionTime = block.timestamp;
            emit PhaseChanged(gameId, GamePhase.Planning);
        }
    }

    function _processDefends(
        uint256 gameId,
        uint8[] memory unitIds,
        uint8[] memory actions
    ) internal {
        for (uint256 i = 0; i < unitIds.length; i++) { // uint256 instead of uint8
            if (actions[i] == 2) {
                Unit storage unit = units[gameId][unitIds[i]];
                if (unit.isAlive) {
                    defendingUnits[gameId][unitIds[i]] = true;
                    emit UnitDefending(gameId, unitIds[i]);
                }
            }
        }
    }

    function _processMoves(
        uint256 gameId,
        uint8[] memory unitIds,
        uint8[] memory actions,
        uint8[] memory targetX,
        uint8[] memory targetY
    ) internal {
        for (uint256 i = 0; i < unitIds.length; i++) { // uint256
            if (actions[i] == 0) {
                Unit storage unit = units[gameId][unitIds[i]];
                if (!unit.isAlive) continue;
                
                if (!combat.canMove(unit.x, unit.y, targetX[i], targetY[i])) continue;
                
                uint8 oldX = unit.x;
                uint8 oldY = unit.y;
                
                battlefield[gameId][unit.x][unit.y] = 0;
                
                if (battlefield[gameId][targetX[i]][targetY[i]] == 0) {
                    unit.x = targetX[i];
                    unit.y = targetY[i];
                    battlefield[gameId][targetX[i]][targetY[i]] = unitIds[i] + 1;
                    emit UnitMoved(gameId, unitIds[i], oldX, oldY, targetX[i], targetY[i]);
                } else {
                    battlefield[gameId][unit.x][unit.y] = unitIds[i] + 1;
                }
            }
        }
    }

    function _processAttacks(
        uint256 gameId,
        uint8[] memory unitIds,
        uint8[] memory actions,
        uint8[] memory targetX,
        uint8[] memory targetY
    ) internal {
        for (uint256 i = 0; i < unitIds.length; i++) { // uint256
            if (actions[i] == 1) {
                _executeAttack(gameId, unitIds[i], targetX[i], targetY[i]);
            }
        }
    }

    function _executeAttack(
        uint256 gameId,
        uint8 attackerId,
        uint8 targetX,
        uint8 targetY
    ) internal {
        Unit storage attacker = units[gameId][attackerId];
        if (!attacker.isAlive) return;
        
        bool isRanged = attacker.unitType == UnitType.Archer;
        if (!combat.canAttack(attacker.x, attacker.y, targetX, targetY, isRanged)) return;
        
        uint8 targetUnitId = battlefield[gameId][targetX][targetY];
        if (targetUnitId == 0) return;
        
        Unit storage target = units[gameId][targetUnitId - 1];
        if (!target.isAlive || target.owner == attacker.owner) return;
        
        uint8 damage = combat.calculateDamage(
            attacker.attack,
            target.defense,
            defendingUnits[gameId][targetUnitId - 1]
        );
        
        emit UnitAttacked(gameId, attackerId, targetUnitId - 1, damage);
        
        if (damage >= target.health) {
            target.health = 0;
            target.isAlive = false;
            battlefield[gameId][target.x][target.y] = 0;
        } else {
            target.health -= damage;
        }
    }

    function _checkWinCondition(uint256 gameId) internal returns (bool) {
        Game storage game = games[gameId];
        
        if (!units[gameId][0].isAlive) {
            game.winner = game.player2;
            return true;
        }
        if (!units[gameId][3].isAlive) {
            game.winner = game.player1;
            return true;
        }
        return false;
    }

    function _isValidDeploymentZone(bool isPlayer1, uint8 y) internal pure returns (bool) {
        return isPlayer1 ? (y >= 3 && y <= 4) : (y <= 1);
    }

    function _getUnitHealth(UnitType unitType) internal pure returns (uint8) {
        if (unitType == UnitType.Commander) return 20;
        if (unitType == UnitType.Warrior) return 15;
        return 10;
    }

    function _getUnitAttack(UnitType unitType) internal pure returns (uint8) {
        if (unitType == UnitType.Commander) return 5;
        if (unitType == UnitType.Warrior) return 7;
        return 6;
    }

    function _getUnitDefense(UnitType unitType) internal pure returns (uint8) {
        if (unitType == UnitType.Commander) return 3;
        if (unitType == UnitType.Warrior) return 2;
        return 1;
    }

    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }

    function getUnit(uint256 gameId, uint8 unitId) external view returns (Unit memory) {
        return units[gameId][unitId];
    }

    function getTile(uint256 gameId, uint8 x, uint8 y) external view returns (uint8) {
        return battlefield[gameId][x][y];
    }

    function getAllUnits(uint256 gameId) external view returns (Unit[] memory) {
        Unit[] memory allUnits = new Unit[](6);
        for (uint256 i = 0; i < 6; i++) {
            allUnits[i] = units[gameId][uint8(i)];
        }
        return allUnits;
    }
}