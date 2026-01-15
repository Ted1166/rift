// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PlayerStats {
    struct Stats {
        uint256 gamesPlayed;
        uint256 wins;
        uint256 losses;
        uint256 totalDamageDealt;
        uint256 totalUnitsKilled;
        uint256 winStreak;
        uint256 bestWinStreak;
    }

    address public gameFactory;
    mapping(address => Stats) public playerStats;
    
    address[] public rankedPlayers;
    mapping(address => bool) public isRanked;

    event StatsUpdated(address indexed player, uint256 wins, uint256 losses);
    event NewHighScore(address indexed player, uint256 winStreak);

    modifier onlyGameFactory() {
        require(msg.sender == gameFactory, "Only factory");
        _;
    }

    constructor(address _gameFactory) {
        gameFactory = _gameFactory;
    }

    function recordGameResult(
        address winner,
        address loser,
        uint256 damageDealt,
        uint256 unitsKilled
    ) external onlyGameFactory {
        // Update winner stats
        Stats storage winnerStats = playerStats[winner];
        winnerStats.gamesPlayed++;
        winnerStats.wins++;
        winnerStats.totalDamageDealt += damageDealt;
        winnerStats.totalUnitsKilled += unitsKilled;
        winnerStats.winStreak++;
        
        if (winnerStats.winStreak > winnerStats.bestWinStreak) {
            winnerStats.bestWinStreak = winnerStats.winStreak;
            emit NewHighScore(winner, winnerStats.winStreak);
        }

        // Update loser stats
        Stats storage loserStats = playerStats[loser];
        loserStats.gamesPlayed++;
        loserStats.losses++;
        loserStats.winStreak = 0;

        // Add to ranked list if new
        if (!isRanked[winner]) {
            rankedPlayers.push(winner);
            isRanked[winner] = true;
        }
        if (!isRanked[loser]) {
            rankedPlayers.push(loser);
            isRanked[loser] = true;
        }

        emit StatsUpdated(winner, winnerStats.wins, winnerStats.losses);
        emit StatsUpdated(loser, loserStats.wins, loserStats.losses);
    }

    function getStats(address player) external view returns (Stats memory) {
        return playerStats[player];
    }

    function getWinRate(address player) external view returns (uint256) {
        Stats memory stats = playerStats[player];
        if (stats.gamesPlayed == 0) return 0;
        return (stats.wins * 100) / stats.gamesPlayed;
    }

    function getTopPlayers(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        uint256 count = rankedPlayers.length < limit ? rankedPlayers.length : limit;
        address[] memory players = new address[](count);
        uint256[] memory wins = new uint256[](count);

        // Simple bubble sort for top players
        address[] memory sorted = rankedPlayers;
        for (uint256 i = 0; i < sorted.length; i++) {
            for (uint256 j = i + 1; j < sorted.length; j++) {
                if (playerStats[sorted[i]].wins < playerStats[sorted[j]].wins) {
                    address temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }

        for (uint256 i = 0; i < count; i++) {
            players[i] = sorted[i];
            wins[i] = playerStats[sorted[i]].wins;
        }

        return (players, wins);
    }
}