//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMinter is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event NewNFTMinted(address sender, uint256 tokenId);

    constructor(string memory tokenName, string memory symbol) ERC721(tokenName, symbol) {

    }

    function _baseURI() internal view override returns (string memory) {
  return "ipfs://";
}

    function mintToken(address owner, string memory metadataURI)
    public
    {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _safeMint(owner, id);
        _setTokenURI(id, metadataURI);
        emit NewNFTMinted(owner, id);
    }
}
