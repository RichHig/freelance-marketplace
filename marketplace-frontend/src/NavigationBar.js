// src/NavigationBar.js
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = ({ connectedAccount, disconnect }) => {
  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          GlobalFreelance
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/browse-jobs">
              Browse Jobs
            </Nav.Link>
            <Nav.Link as={Link} to="/post-job">
              Post a Job
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link disabled>
              Account: {connectedAccount.slice(0, 6)}...
              {connectedAccount.slice(-4)}
            </Nav.Link>
            <Button variant="outline-danger" onClick={disconnect}>
              Disconnect
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
