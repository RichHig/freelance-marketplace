// src/SubmitBid.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

function SubmitBid({ walletData }) {
  const [jobId, setJobId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [proposal, setProposal] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert bid amount from ETH to Wei
      const parsedBidAmount = ethers.parseEther(bidAmount);
      const tx = await walletData.marketplaceContract.submitBid(
        jobId,
        parsedBidAmount,
        proposal
      );
      await tx.wait();
      alert("Bid submitted successfully!");
      setJobId("");
      setBidAmount("");
      setProposal("");
    } catch (error) {
      console.error(error);
      alert("Error submitting bid. Check console for details.");
    }
  };

  return (
    <Container className="my-4">
      <h2>Submit a Bid</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Group controlId="bidJobId">
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
            <Form.Group controlId="bidAmount">
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
          <Col md={4}>
            <Form.Group controlId="proposal">
              <Form.Label>Proposal</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Submit Bid
        </Button>
      </Form>
    </Container>
  );
}

export default SubmitBid;
