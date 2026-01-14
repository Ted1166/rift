// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Combat {
    
    function calculateDamage(
        uint8 attackPower,
        uint8 defensePower,
        bool isDefending
    ) external pure returns (uint8) {
        uint8 baseDamage = attackPower > defensePower ? attackPower - defensePower : 1;
        
        if (isDefending) {
            return baseDamage / 2;
        }
        
        return baseDamage;
    }

    function canAttack(
        uint8 attackerX,
        uint8 attackerY,
        uint8 targetX,
        uint8 targetY,
        bool isRanged
    ) external pure returns (bool) {
        uint8 distance = _getDistance(attackerX, attackerY, targetX, targetY);
        
        if (isRanged) {
            return distance <= 2 && distance > 0; 
        } else {
            return distance == 1; 
        }
    }

    function canMove(
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) external pure returns (bool) {
        if (toX >= 5 || toY >= 5) return false;
        
        uint8 distance = _getDistance(fromX, fromY, toX, toY);
        return distance == 1; 
    }

    function _getDistance(uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal pure returns (uint8) {
        if (x1 >= 5 || y1 >= 5 || x2 >= 5 || y2 >= 5) return 255;
        
        uint8 dx = x1 > x2 ? x1 - x2 : x2 - x1;
        uint8 dy = y1 > y2 ? y1 - y2 : y2 - y1;
        return dx + dy; 
    }
}