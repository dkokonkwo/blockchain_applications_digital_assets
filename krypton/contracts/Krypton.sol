// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";


contract Krypton is ERC721, ERC721URIStorage, Ownable, IERC721Receiver {
    uint256 private _nextTokenId = 1;

    mapping(string => uint8) existingURIs;
    mapping(uint256 => uint256) public tokenPrices;

    mapping(uint256 => bytes32) public tokenHashes;      // Stores token hash
    mapping(uint256 => uint256) public tokenTimestamps; // Stores last update timestamp
    mapping(uint256 => uint256) private transferCounts;

    uint256 public alertThreshold = 3; // Example: More than 3 transfers in a short time

    event NFTMinted(address indexed owner, uint256 tokenId, string metadataURI);
    event NFTPurchased(address indexed buyer, address indexed seller, uint256 tokenId, uint256 price);
    event SuspiciousActivityDetected(uint256 tokenId, address indexed owner);
    event ReceivedETH(address sender, uint256 amount);

    constructor(address initialOwner)
        ERC721("Krypton", "KTN")
        Ownable()
    {
        _transferOwnership(initialOwner); // Set the owner
    }

    // Implement IERC721Receiver's onERC721Received function
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // Return this constant to signal the contract is able to handle ERC721 tokens
        return IERC721Receiver.onERC721Received.selector;
    }

    // Allows contract to receive ETH
    receive() external payable {
        emit ReceivedETH(msg.sender, msg.value);
    }

    // Fallback function to handle unexpected ETH transfers
    fallback() external payable {
        emit ReceivedETH(msg.sender, msg.value);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
    }

    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        require(existingURIs[uri] == 0, "URI already used");
        existingURIs[uri] = 1;
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        tokenTimestamps[tokenId] = block.timestamp; // Store minting time
        tokenHashes[tokenId] = keccak256(abi.encodePacked(tokenId, to, block.timestamp)); // Store hash

        emit NFTMinted(to, tokenId, uri);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return interfaceId == type(IERC721Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        override(ERC721, IERC721)
        returns (bool) {
        return true; // Approves all callers
    }

    modifier onlyTokenOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "Not the asset owner");
        _;
    }

    function payToMint(address recipient, string memory metadataURI)  public payable returns (uint256) {
        require(existingURIs[metadataURI] == 0, "URI already used");
        require (msg.value >= 0.05 ether, "Need to pay up!");
        existingURIs[metadataURI] = 1;
        uint256 tokenId = _nextTokenId++; 
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        tokenTimestamps[tokenId] = block.timestamp; // Store minting time
        tokenHashes[tokenId] = keccak256(abi.encodePacked(tokenId, recipient, block.timestamp)); // Store hash

        emit NFTMinted(recipient, tokenId, metadataURI);
        return tokenId;
    }

    function buyToken(uint256 tokenId) public payable {
        uint256 price = tokenPrices[tokenId];
        address seller = ownerOf(tokenId);

        require(price > 0, "Token not for sale");
        require(msg.value >= price, "Insufficient funds");

        // Transfer funds to the seller
        (bool success, ) = payable(seller).call{value: price}("");
        require(success, "Transfer failed");
        // Transfer ownership of the token
        safeTransferFrom(seller, msg.sender, tokenId);

        transferCounts[tokenId]++;

        // Suspicious activity detection
        if (transferCounts[tokenId] > alertThreshold) {
            emit SuspiciousActivityDetected(tokenId, msg.sender);
        }

        // Clear the sale price after purchase
        tokenPrices[tokenId] = 0;

        emit NFTPurchased(msg.sender, seller, tokenId, price);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override {
        super._transfer(from, to, tokenId);

        if (from != address(0)) { // Ensure it's not a minting operation
            tokenTimestamps[tokenId] = block.timestamp; // Update transfer timestamp
            tokenHashes[tokenId] = keccak256(abi.encodePacked(tokenId, to, block.timestamp)); // Update hash value
            transferCounts[tokenId] = 0;
        }
    }

    function getTokenHash(uint256 tokenId) public view returns (bytes32) {
        require(_exists(tokenId), "Token does not exist");
        return tokenHashes[tokenId];
    }

    function getTokenTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return tokenTimestamps[tokenId];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    require(balance > 0, "No funds to withdraw");
    payable(owner()).transfer(balance);
    }

    function setTokenPrice(uint256 tokenId, uint256 price) public onlyTokenOwner(tokenId) {
        tokenPrices[tokenId] = price;
    }

    function count() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    function getTokensForSale() public view returns (uint256[] memory, uint256[] memory) {
        uint256 totalTokens = _nextTokenId - 1;
        uint256 saleCount = 0;

        for (uint256 tokenId = 1; tokenId <= totalTokens; tokenId++) {
            if (tokenPrices[tokenId] > 0) {
                saleCount++;
            }
        }

        uint256[] memory tokenIds = new uint256[](saleCount);
        uint256[] memory prices = new uint256[](saleCount);
        uint256 index = 0;

        for (uint256 tokenId = 1; tokenId <= totalTokens; tokenId++) {
            if (tokenPrices[tokenId] > 0) {
                tokenIds[index] = tokenId;
                prices[index] = tokenPrices[tokenId];
                index++;
            }
        }

        return (tokenIds, prices);
    }
}