// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT_Transfer is ERC721,Ownable{
    string private TokenUri;
    using Strings for uint256;
    address ownedBY;

    constructor(string memory _TokenUri) ERC721("NonFungibleToken","NFT"){
        TokenUri = _TokenUri;
        ownedBY = msg.sender;
    }

    function mint(address _to, uint256 tokenId) public onlyOwner{
        _mint(_to, tokenId);
    }

    function transferNFT(address to, uint256 tokenId) public{
        require(_isApprovedOrOwner(msg.sender,tokenId),"Not approved");
        // require(msg.sender == ownedBY || isApprovedForAll(ownedBY, msg.sender),"Not approved");
        _transfer(ownedBY, to, tokenId);
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        TokenUri = baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(TokenUri, tokenId.toString(),".json"));
    }
    
}

//QmQMdbdTtKPdxBM8DG8ggnuzrDzP51F8i4xQbYoX9PrLj3
//QmbfTP9Wd15N3MY13Y7ucb5LmQrqJy4Peesag4iNbFqsHM
//Qmc7m6i1kyBWMBKAHxjemqxh159xd1Wzv5hPCrPARmgpP5