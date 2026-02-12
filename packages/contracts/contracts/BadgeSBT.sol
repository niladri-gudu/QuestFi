// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BadgeSBT is ERC721URIStorage, Ownable {
  constructor(address initialOwner)
    ERC721("QuestFi Badge", "QFB")
    Ownable(initialOwner)
  {}
  
  uint256 public nextTokenId;
  address public minter;

  event BadgeMinted(
    address indexed user,
    uint256 indexed tokenId
  );

  error Soulbound();
  error NotMinter();

  function setMinter(address _minter) external onlyOwner {
    minter = _minter;
  }

  function mintBadge(
    address user,
    string calldata uri
  ) external {
    if (msg.sender != minter) revert NotMinter();

    uint256 tokenId = nextTokenId++;

    _safeMint(user, tokenId);
    _setTokenURI(tokenId, uri);

    emit BadgeMinted(user, tokenId);
  }

  function _update(
    address to,
    uint256 tokenId,
    address auth
  ) internal override(ERC721) returns (address) {
    if (to != address(0) && _ownerOf(tokenId) != address(0)) revert Soulbound();
    return super._update(to, tokenId, auth);
  }

  function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
