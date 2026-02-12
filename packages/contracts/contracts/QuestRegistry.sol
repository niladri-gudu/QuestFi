// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract QuestRegistry is Ownable {
  uint256 public nextQuestId;
  
  enum QuestType {
    TX,
    SIGN,
    MULTI
  }

  struct Quest {
    string metadataHash;
    QuestType questType;
    bool isActive;
    uint256 startTime;
    uint256 endTime;
  }

  mapping (uint256 => Quest) public quests;

  error InvalidMetadata();
  error QuestNotFound();
  error InvalidTimeRange();
  
  event QuestCreated(
    uint256 indexed questId,
    string metadataHash,
    QuestType indexed questType,
    uint256 startTime,
    uint256 endTime
  );
  event QuestStatusUpdated(uint256 indexed questId, bool isActive);

  constructor(address initialOwner) Ownable(initialOwner) {}
  
  function createQuest(
    string calldata metadataHash,
    QuestType questType,
    uint256 endTime
  ) external onlyOwner {
    if (bytes(metadataHash).length == 0) revert InvalidMetadata();
    
    uint256 startTime = block.timestamp;
    if (endTime <= startTime) revert InvalidTimeRange();

    uint256 id = nextQuestId++;

    quests[id] = Quest({
      metadataHash: metadataHash,
      questType: questType,
      isActive: true,
      startTime: startTime,
      endTime: endTime
    });

    emit QuestCreated(id, metadataHash, questType, startTime, endTime);
  }

  function setQuestStatus(uint256 id, bool active) external onlyOwner {
    if (bytes(quests[id].metadataHash).length == 0) revert QuestNotFound();
    
    quests[id].isActive = active;
    
    emit QuestStatusUpdated(id, active);
  }

  function getQuestMetadata(uint256 id) external view returns (string memory) {
    if (bytes(quests[id].metadataHash).length == 0) revert QuestNotFound();

    return quests[id].metadataHash;
  }

  function totalQuests() external view returns (uint256) {
    return nextQuestId;
  }

  function isQuestActive(uint256 id) external view returns (bool) {
    if (bytes(quests[id].metadataHash).length == 0) revert QuestNotFound();

    Quest storage q = quests[id];

    uint256 time = block.timestamp;

    return q.isActive && time >= q.startTime && time <= q.endTime;
  }
}
