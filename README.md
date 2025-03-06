**Question 2: Protecting Digital Assets Using Blockchain**

In this project, students should focus on leveraging blockchain technology—specifically the Ethereum blockchain—to secure and manage digital assets. Digital assets can include cryptocurrencies, digital artworks, tokens, and other forms of valuable digital property. Blockchain's decentralized ledger and smart contract functionality offer a robust solution for ensuring asset authenticity, secure ownership, and protection against unauthorized alterations.

**LINK TO ZIP FILE:** https://drive.google.com/file/d/1UT94WlT7CSBnM86kyHXe2mx6JHs36mIm/view?usp=drive_link

# Krypton NFT Marketplace

## Overview
Krypton is a decentralized NFT marketplace that allows users to mint, register, and trade digital assets securely on the Ethereum blockchain. The project consists of a **React frontend** using **Bootstrap** and **Iconsax**, and a **Solidity smart contract (Krypton.sol)** deployed via **Hardhat, Waffle, and Truffle**. The **Ethers.js** library facilitates interaction between the frontend and the smart contract, and **Remix IDE** is used for contract testing.

## Features
- **Mint Digital Assets**: Users can register their digital assets by minting an NFT using the `payToMint` function.
- **View Asset Information**: Users can see metadata, hash, timestamps, and ownership details.
- **Buy and Sell NFTs**: Users can purchase NFTs listed for sale.
- **Secure Transactions**: The smart contract ensures ownership verification and transaction integrity.

## Tech Stack
### **Frontend**
- **React.js** - UI framework
- **Bootstrap** - Styling framework
- **Iconsax** - Icon library
- **Ethers.js** - Blockchain interaction

### **Backend (Smart Contract)**
- **Solidity** - Smart contract language
- **Hardhat** - Development and testing framework
- **Waffle** - Testing suite
- **Truffle** - Deployment and testing framework
- **Remix IDE** - Contract debugging and testing

## Project Structure
```
Krypton-Marketplace/
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Application pages
│   │   ├── context/      # Blockchain context (ethers.js integration)
│   │   ├── App.js        # Main React component
│   │   ├── index.js      # Entry point
│   │   ├── styles.css    # Custom styles
│   ├── package.json      # Dependencies
│   ├── .env              # Environment variables (INFURA, private keys)
│
├── smart-contracts/
│   ├── contracts/
│   │   ├── Krypton.sol   # Smart contract file
│   ├── scripts/
│   │   ├── deploy.js     # Deployment script
│   ├── test/
│   │   ├── Krypton.test.js # Hardhat tests
│   ├── hardhat.config.js # Hardhat configuration
│   ├── truffle-config.js # Truffle configuration
│
├── README.md
├── .gitignore
```

## Smart Contract (Krypton.sol)
The **Krypton** smart contract manages NFT creation, ownership, and transactions.

### **Key Functions**
#### `payToMint(address recipient, string memory metadataURI) public payable returns (uint256)`
- Allows users to **mint** a new NFT by paying a fee.
- Stores metadata URI and ownership details.
- Emits an `NFTMinted` event.

#### `buyToken(uint256 tokenId) public payable`
- Enables users to **purchase NFTs** listed for sale.
- Transfers ownership and sends funds to the seller.
- Emits an `NFTPurchased` event.

#### `getTokenHash(uint256 tokenId) public view returns (bytes32)`
- Returns the unique **hash** associated with an NFT.

#### `getTokenTimestamp(uint256 tokenId) public view returns (uint256)`
- Retrieves the **timestamp** of the last update.

#### `getTokensForSale() public view returns (uint256[] memory, uint256[] memory)`
- Returns an array of **token IDs and prices** for NFTs currently on sale.

## Deployment & Testing
### **1. Install Dependencies**
Run the following command in both `frontend/` and `smart-contracts/`:
```sh
npm install
```

### **2. Compile the Smart Contract**
```sh
npx hardhat compile
```

### **3. Deploy the Contract**
```sh
npx hardhat run scripts/deploy.js --network localhost
```

### **4. Run Tests**
```sh
npx hardhat test
```

### **5. Start the Frontend**
```sh
npm start
```

## Interacting with the Smart Contract
You can interact with the deployed contract using **Ethers.js** in the frontend:

### **Connecting to MetaMask**
```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
```

### **Minting an NFT**
```javascript
const contract = new ethers.Contract(contractAddress, abi, signer);
const tx = await contract.payToMint(userAddress, metadataURI, { value: ethers.utils.parseEther("0.05") });
await tx.wait();
```

### **Buying an NFT**
```javascript
const tx = await contract.buyToken(tokenId, { value: priceInWei });
await tx.wait();
```

## Limitations & Security Considerations ⚠️
**This project is a small-scale marketplace prototype and should not be considered an enterprise-grade blockchain solution.**

### Limitations:
1. **All users are auto-approved** using `setApprovedAll`, meaning the contract does not have a strict access control mechanism for trading.
2. **No off-chain verification** for metadata (stored hashes help, but there's no external validation system).
3. **Basic security** – The contract lacks advanced protections against potential attack vectors like **re-entrancy attacks**.

### Future Improvements:
- Implement **role-based access control**.
- Improve security for **token transfers and approvals**.
- Introduce **escrow mechanisms** to prevent scams.

## License
This project is licensed under the **MIT License**.

## Authors
- **David Okonkwo** (@dkokonkwo)

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch.
3. Implement changes and commit.
4. Submit a pull request.

---
Feel free to reach out if you need any assistance!

**REQUIREMENTS**

Key Components:
Digital Asset Registration:
Utilize Ethereum smart contracts to register digital assets.
Record critical metadata such as the asset's cryptographic hash, owner identity, and timestamp.
Ensure the metadata remains immutable once recorded on the blockchain.
Ownership and Transfer Management:
Implement mechanisms to securely transfer asset ownership using blockchain transactions.
Maintain a transparent, tamper-proof history of all asset transfers.
Asset Integrity Verification:
Develop tools that enable users to verify the integrity and authenticity of their digital assets using cryptographic proofs.
Automatically detect any unauthorized changes or duplication attempts.
User Interaction:
Create an intuitive user interface (e.g., a web portal or mobile app) that allows users to register, manage, and verify their digital assets.
Provide real-time access to asset details and transaction history.
Audit and Monitoring:
Leverage the transparency of blockchain to perform continuous audits of asset transactions.
Set up automated alerts to notify users of any suspicious activities related to their assets.
Implementation Steps:

Smart Contract Development:
Design and deploy an Ethereum smart contract to securely store digital asset metadata and manage ownership records.
Digital Asset Registration Process:
Develop a user interface for asset registration where users can submit asset details (including a cryptographic hash) to be recorded on the blockchain.
Ownership and Transfer Mechanism:
Implement smart contract functions that facilitate secure transfers of digital asset ownership, ensuring that all transactions are logged on the blockchain.
User Interface Development:
Create a user-friendly front-end application (web or mobile) that allows users to register, view, and manage their digital assets easily.
Security and Audit Features:
Integrate tools for continuous monitoring and auditing of asset transactions.
Implement automated alerts for detecting suspicious activities related to digital assets.
Testing and Deployment:
Conduct extensive testing on an Ethereum test network (e.g., Ropsten) to validate the system’s functionality and security.
Deploy the final solution on the Ethereum mainnet once testing is complete.
Submission Instructions

Packaging Your Submission:
Compress your project into a single ZIP file. The ZIP file should contain:
All source code files (including smart contracts, scripts, and any front-end code).
Configuration files and any dependencies necessary for running your project.
A README file with setup instructions, usage guidelines, and any prerequisites.
A detailed project report (in PDF format) that explains your project approach, design, implementation, testing, and conclusions.
README File Requirements:
Include a brief overview of your project.
Provide clear instructions on how to compile, deploy, and run the project.
Specify the software environment, tools, and versions used (e.g., Solidity version, Ethereum test network details, any libraries or frameworks).
Mention any known issues or limitations.
Project Report (PDF):
Abstract: A concise summary of your project and its objectives.
Introduction: Explain the importance of protecting digital assets using blockchain and outline the project's goals.
Methodology: Describe your design decisions, the architecture of your solution, and the implementation details.
Implementation: Provide screenshots or diagrams of key components (e.g., smart contract structure, UI, blockchain transactions).
Link to the GitHub Repo.