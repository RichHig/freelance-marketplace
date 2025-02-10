// src/AcceptBid.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

function AcceptBid({ walletData }) {
  const [jobId, setJobId] = useState("");
  const [bidIndex, setBidIndex] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert bid amount from ETH to Wei
      const parsedBidAmount = ethers.parseEther(bidAmount);
      const tx = await walletData.marketplaceContract.acceptBid(
        jobId,
        bidIndex,
        { value: parsedBidAmount }
      );
      await tx.wait();
      alert("Bid accepted successfully!");
      setJobId("");
      setBidIndex("");
      setBidAmount("");
    } catch (error) {
      console.error(error);
      alert("Error accepting bid. Check console for details.");
    }
  };

  return (
    <Container className="my-4">
      <h2>Accept a Bid</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="acceptJobId">
              <Form.Label>Job ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter job ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="bidIndex">
              <Form.Label>Bid Index</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter bid index"
                value={bidIndex}
                onChange={(e) => setBidIndex(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="acceptBidAmount">
              <Form.Label>Bid Amount (in ETH)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit" className="mt-3">
          Accept Bid
        </Button>
      </Form>
    </Container>
  );
}

export default AcceptBid;
