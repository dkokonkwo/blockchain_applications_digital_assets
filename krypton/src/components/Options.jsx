import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ethers } from "ethers";
import Krypton from "../artifacts/contracts/Krypton.sol/Krypton.json";
import AssetInfo from "./AssetInfo";
import BuyToken from "./BuyToken";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

function Options({ isMinted, mintToken, tokenId }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [contract, setContract] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const initializeContract = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractP = new ethers.Contract(
        contractAddress,
        Krypton.abi,
        provider
      );
      const contractInstance = new ethers.Contract(
        contractAddress,
        Krypton.abi,
        signer
      );
      setContract2(contractP);
      setContract(contractInstance);
    };

    initializeContract();
  }, []); // Runs once on component mount

  useEffect(() => {
    if (contract) {
      isTokenOwner();
      isTokenForSale();
    }
  }, [contract]); // Runs whenever `contract` is updated

  const isTokenOwner = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("current user account: ", account);
    if (isMinted) {
      try {
        const tokenOwner = await contract.ownerOf(tokenId + 1);
        console.log(
          "Owner: ",
          tokenOwner.toLowerCase(),
          "User: ",
          account.toLowerCase()
        );
        setIsOwner(tokenOwner.toLowerCase() === account.toLowerCase()); // Use strict equality
      } catch (error) {
        console.error("Error fetching token owner:", error);
      }
    }
  };

  const isTokenForSale = async () => {
    try {
      const result = await contract.getTokensForSale();
      console.log("result", result);
      const index = result[0]
        .map((item) => parseInt(item, 10)) // Parse each item to an integer
        .findIndex((value) => value === tokenId + 1);
      if (index !== -1) {
        const ans = parseInt(result[1][index], 10);
        setPrice(ans); // Set the index value if the item is found
        setIsForSale(true);
        console.log(`Item found at index: ${index} price : ${ans}`);
      } else {
        setIsForSale(false);
      }
    } catch (error) {
      console.error("Error fetching tokens for sale:", error);
    }
  };

  const putForSale = async (price) => {
    try {
      if (!price) {
        throw new Error("Invalid token ID or price");
      }
      const result = await contract.setTokenPrice(
        tokenId + 1,
        ethers.parseEther(price)
      );
      console.log("Transaction sent. Waiting for confirmation...");
      await result.wait();
      console.log("Token is now for sale!");
      alert("Token is now for sale!");
    } catch (error) {
      console.error("Error setting token price:", error);
    }
  };

  return (
    <div className="options">
      {!isMinted ? (
        <Button onClick={mintToken} className="mint-btn">
          Mint
        </Button>
      ) : (
        <>
          {isOwner && isForSale && (
            <AssetInfo
              tokenID={tokenId + 1}
              name={kryptonCollection[tokenId]}
            />
          )}
          {isOwner && !isForSale && (
            <div className="sell">
              <AssetInfo
                tokenID={tokenId + 1}
                name={kryptonCollection[tokenId]}
              />
              <SellToken putForSale={putForSale} />
            </div>
          )}
          {!isOwner && isForSale && (
            <BuyToken price={price} contract={contract} tokenId={tokenId} />
          )}
          {!isOwner && !isForSale && (
            <AssetInfo
              tokenID={tokenId + 1}
              name={kryptonCollection[tokenId]}
            />
          )}
        </>
      )}
    </div>
  );
}

function SellToken({ putForSale }) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");

  const handleInputChange = (e) => {
    setAmount(e.target.value); // Update state when input changes
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Amount entered:", amount);
    putForSale(amount); // Process the form data
    // Add further logic here, e.g., send data to a smart contract
    handleClose();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="for-sale">
      <Button variant="primary" onClick={handleShow}>
        Sell
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Set Your Token Selling Price</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Amount(In ETH)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0 ETH"
                value={amount}
                onChange={handleInputChange}
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Set Price
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Options;
