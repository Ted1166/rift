// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Leaderboard {
    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        uint256 gamesPlayed;
        uint256 elo;
    }

    mapping(address => PlayerStats) public stats;
    address[] public rankedPlayers;
    
    uint256 public constant STARTING_ELO = 1000;
    uint256 public constant K_FACTOR = 32;

    event StatsUpdated(address indexed player, uint256 wins, uint256 losses, uint256 elo);
    event GameRecorded(address indexed winner, address indexed loser, uint256 winnerElo, uint256 loserElo);

    function recordGame(address winner, address loser) external {
        if (stats[winner].gamesPlayed == 0) {
            stats[winner].elo = STARTING_ELO;
            rankedPlayers.push(winner);
        }
        if (stats[loser].gamesPlayed == 0) {
            stats[loser].elo = STARTING_ELO;
            rankedPlayers.push(loser);
        }

        stats[winner].wins++;
        stats[winner].gamesPlayed++;
        stats[loser].losses++;
        stats[loser].gamesPlayed++;

        (uint256 winnerNewElo, uint256 loserNewElo) = _calculateElo(
            stats[winner].elo,
            stats[loser].elo
        );

        stats[winner].elo = winnerNewElo;
        stats[loser].elo = loserNewElo;

        emit GameRecorded(winner, loser, winnerNewElo, loserNewElo);
        emit StatsUpdated(winner, stats[winner].wins, stats[winner].losses, winnerNewElo);
        emit StatsUpdated(loser, stats[loser].wins, stats[loser].losses, loserNewElo);
    }

    function getStats(address player) external view returns (
        uint256 wins,
        uint256 losses,
        uint256 gamesPlayed,
        uint256 elo
    ) {
        PlayerStats memory s = stats[player];
        return (s.wins, s.losses, s.gamesPlayed, s.elo);
    }

    function getTopPlayers(uint256 n) external view returns (
        address[] memory players,
        uint256[] memory elos
    ) {
        uint256 count = rankedPlayers.length < n ? rankedPlayers.length : n;
        players = new address[](count);
        elos = new uint256[](count);

        address[] memory sorted = new address[](rankedPlayers.length);
        for (uint256 i = 0; i < rankedPlayers.length; i++) {
            sorted[i] = rankedPlayers[i];
        }

        for (uint256 i = 0; i < sorted.length; i++) {
            for (uint256 j = i + 1; j < sorted.length; j++) {
                if (stats[sorted[j]].elo > stats[sorted[i]].elo) {
                    address temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }

        for (uint256 i = 0; i < count; i++) {
            players[i] = sorted[i];
            elos[i] = stats[sorted[i]].elo;
        }

        return (players, elos);
    }

    function _calculateElo(uint256 winnerElo, uint256 loserElo) internal pure returns (uint256, uint256) {
        uint256 winnerExpected = _expectedScore(winnerElo, loserElo);
        uint256 loserExpected = 1000 - winnerExpected; 

        uint256 winnerChange = (K_FACTOR * (1000 - winnerExpected)) / 1000;
        uint256 loserChange = (K_FACTOR * loserExpected) / 1000;

        uint256 newWinnerElo = winnerElo + winnerChange;
        uint256 newLoserElo = loserElo > loserChange ? loserElo - loserChange : 0;

        return (newWinnerElo, newLoserElo);
    }

    function _expectedScore(uint256 playerElo, uint256 opponentElo) internal pure returns (uint256) {
        int256 diff = int256(playerElo) - int256(opponentElo);
        
        if (diff >= 400) return 950;
        if (diff >= 200) return 750;
        if (diff >= 100) return 640;
        if (diff >= 0) return 500;
        if (diff >= -100) return 360;
        if (diff >= -200) return 250;
        if (diff >= -400) return 50;
        return 50;
    }
}