import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Button, Modal, CloseButton } from "react-bootstrap";
import Krypton from "../artifacts/contracts/Krypton.sol/Krypton.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// const provider = new ethers.BrowserProvider(window.ethereum);

// const signer = await provider.getSigner();

// const contract = new ethers.Contract(contractAddress, Krypton.abi, signer);

function AssetInfo({ tokenID, name }) {
  const [show, setShow] = useState(false);
  const [URI, setURI] = useState();
  const [hash, setHash] = useState();
  const [timestamp, setTimestamp] = useState();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function initializeContract() {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            Krypton.abi,
            signer
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Error initializing contract:", error);
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    }
    initializeContract();
  }, []);

  const getHash = async () => {
    if (!contract) return;
    try {
      const result = await contract.getTokenHash(tokenID);
      console.log(result);
      setHash(result);
    } catch (error) {
      console.error("Error fetching token hash:", error);
    }
  };

  const getTimeStamp = async () => {
    if (!contract) return;
    try {
      const result = await contract.getTokenTimestamp(tokenID);
      console.log(result);
      setTimestamp(result);
    } catch (error) {
      console.error("Error fetching token timestamp:", error);
    }
  };

  const getURI = async () => {
    if (!contract) return;
    try {
      const uri = await contract.tokenURI(tokenID);
      console.log(uri);
      setURI(uri);
    } catch (error) {
      console.error("Error fetching token URI:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    getHash();
    getTimeStamp();
    getURI();
    setShow(true);
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow} className="asset-info-btn">
        Asset Info
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{name} Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              <strong>ID:</strong> {tokenID}
            </li>
            <li>
              <strong>Metadata URI:</strong> {URI || "N/A"}
            </li>
            <li>
              <strong>Hash:</strong> {hash || "N/A"}
            </li>
            <li>
              <strong>Timestamp:</strong> {timestamp || "N/A"}
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AssetInfo;
