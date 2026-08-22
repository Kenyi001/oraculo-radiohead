// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CasandraRegistry — minimal risk snapshot anchor for Aleph 2026
/// @notice Not financial advice. Stores hashed portfolio risk snapshots for demo/audit.
contract CasandraRegistry {
    struct Snapshot {
        bytes32 portfolioHash;
        uint8 band; // 0=low, 1=med, 2=high
        uint256 score; // 0–100
        uint256 timestamp;
        address publisher;
    }

    event RiskSnapshotPublished(
        uint256 indexed id,
        bytes32 portfolioHash,
        uint8 band,
        uint256 score,
        uint256 timestamp,
        address indexed publisher
    );

    Snapshot[] public snapshots;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    /// @param portfolioHash keccak256 of canonical portfolio JSON / positions
    /// @param band 0 low · 1 med · 2 high
    /// @param score 0–100 casandra-risk-v1
    /// @param timestamp unix seconds (off-chain clock)
    function publishRiskSnapshot(
        bytes32 portfolioHash,
        uint8 band,
        uint256 score,
        uint256 timestamp
    ) external returns (uint256 id) {
        require(band <= 2, "band");
        require(score <= 100, "score");
        id = snapshots.length;
        snapshots.push(
            Snapshot({
                portfolioHash: portfolioHash,
                band: band,
                score: score,
                timestamp: timestamp,
                publisher: msg.sender
            })
        );
        emit RiskSnapshotPublished(id, portfolioHash, band, score, timestamp, msg.sender);
    }

    function latestSnapshot() external view returns (Snapshot memory) {
        require(snapshots.length > 0, "empty");
        return snapshots[snapshots.length - 1];
    }

    function snapshotCount() external view returns (uint256) {
        return snapshots.length;
    }
}
