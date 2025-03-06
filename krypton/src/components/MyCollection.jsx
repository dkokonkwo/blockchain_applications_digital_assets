import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import Krypton from "../artifacts/contracts/Krypton.sol/Krypton.json";
import User from "../assets/images/user.jpg";
import Mystery from "../assets/images/mystery.png";
import AssetInfo from "./AssetInfo";
import BuyToken from "./BuyToken";
import Options from "./Options";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.BrowserProvider(window.ethereum);

const signer = await provider.getSigner();

const contract = new ethers.Contract(contractAddress, Krypton.abi, provider);
const contract2 = new ethers.Contract(contractAddress, Krypton.abi, signer);

const kryptonCollection = [
  "blue-bmw",
  "golfball",
  "grey-benz",
  "net",
  "red-mustang",
  "soccer-ball",
  "vintage-red",
  "vintage-yellow",
  "volleyball",
  "white-dodge",
];

function MyCollection() {
  const [totalMinted, setTotalMinted] = useState(0);
  useEffect(() => {
    getCount();
  }, []);
  const getCount = async () => {
    const count = await contract.count();
    console.log(count);
    setTotalMinted(parseInt(count));
  };
  return (
    <div className="krypton-collection">
      <h3>Krypton Collection</h3>
      <h4>Check Our Weekly Updated Trending Collection</h4>
      <div className="card-layout">
        {Array(totalMinted)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="red">
              <NFTImage tokenId={i} getCount={getCount} />
            </div>
          ))}
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const contentId =
    "bafybeighd4mn2lqz7al6cnt6c6allhlyxfdqh3coj7e5kjrrvgusneykvy";
  const metadataURI = `${contentId}/${kryptonCollection[tokenId]}.json`;
  const imageURI = `https://yellow-actual-partridge-846.mypinata.cloud/ipfs/${contentId}/${kryptonCollection[tokenId]}.jpg`;
  const imageURITest = `https://yellow-actual-partridge-846.mypinata.cloud/ipfs/bafybeighd4mn2lqz7al6cnt6c6allhlyxfdqh3coj7e5kjrrvgusneykvy/white-dodge.json`;

  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, []);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
    // const connection = contract2.connect(signer);
    // const addr = await contract2.getAddress();
    // console.log("address:", addr);
  };

  const mintToken = async () => {
    const connection = contract2.connect(signer);
    const addr = await contract2.getAddress();
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(account);
    const result = await contract2.payToMint(account, metadataURI, {
      value: ethers.parseEther("0.05"),
      // gasLimit: ethers.hexlify(300000),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract2.tokenURI(tokenId);
    alert(uri);
  }

  return (
    <div className="myCard">
      <img
        src={isMinted ? imageURI : Mystery}
        alt="NFT preview"
        className="nft-image"
      ></img>
      <div className="card-info">
        <div className="name-owner">
          <h5>{isMinted ? kryptonCollection[tokenId] : `ID #${tokenId}`}</h5>
          {isMinted && (
            <div className="owner">
              <img src={User} alt="owner"></img>
              <h6>Monkwe</h6>
            </div>
          )}
        </div>
        <Options isMinted={isMinted} mintToken={mintToken} tokenId={tokenId} />
      </div>
    </div>
  );
}

export default MyCollection;
