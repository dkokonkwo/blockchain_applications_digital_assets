import React from "react";
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import WalletBalance from "./WalletBalance";
import { CpuCharge } from "iconsax-react";

function MyNavbar() {
  return (
    <Navbar collapseOnSelect expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home">
          <CpuCharge size="32" color="#26B5C5" variant="Bold" />
          <h2>Krypton</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="#deets">Marketplace</Nav.Link>
            <Nav.Link href="#deets">My Collection</Nav.Link>
            <WalletBalance />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
