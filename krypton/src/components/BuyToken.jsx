import React from "react";
import { Button } from "react-bootstrap";

function BuyToken({ price }) {
  const value = 1e18;
  return (
    <div className="buy-token">
      <div className="price-details">
        <p className="price">Price</p>
        <p className="eth">{price > 0 ? `${price/value} ETH` : `NULL`}</p>
      </div>
      <Button>Buy</Button>
    </div>
  );
}

export default BuyToken;
