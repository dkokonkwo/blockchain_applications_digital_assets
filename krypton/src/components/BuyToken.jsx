import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { ethers } from "ethers";
import Krypton from "../artifacts/contracts/Krypton.sol/Krypton.json";

function BuyToken({ price, contract, tokenId }) {
  const value = 1e18;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const buyToken = async () => {
    try {
      const result = await contract.buyToken(tokenId + 1, {
        value: ethers.parseEther(`${price / value}`),
      });
      console.log("Transaction sent. Waiting for confirmation...");
      await result.wait();
      handleClose();
      alert("Your have purchased new asset!");
      console.log("Your have purchased new asset!");
    } catch (error) {
      alert("error:", error);
      console.error("Error buying asset:", error);
    }
  };
  return (
    <div className="buy-token">
      <div className="price-details">
        <p className="price">Price</p>
        <p className="eth">{price > 0 ? `${price / value} ETH` : `NULL`}</p>
      </div>
      <Button onClick={handleShow} disabled={!(price > 0)}>
        Buy
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Purchase Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body className="buy-body">
          <h4>
            <strong>Price:</strong> {price / value} ETH
          </h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={buyToken}>
            Buy Asset
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BuyToken;
