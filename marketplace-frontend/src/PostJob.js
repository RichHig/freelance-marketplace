// src/PostJob.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";

function PostJob({ walletData }) {
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert budget from ETH to Wei using ethers.parseEther
      const parsedBudget = ethers.parseEther(budget);
      const tx = await walletData.marketplaceContract.postJob(
        description,
        parsedBudget
      );
      await tx.wait();
      alert("Job posted successfully!");
      setDescription("");
      setBudget("");
    } catch (error) {
      console.error(error);
      alert("Error posting job. See console for details.");
    }
  };

  return (
    <Container className="my-5">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Group controlId="jobDescription">
              <Form.Label>Job Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="jobBudget">
              <Form.Label>Budget (in ETH)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Post Job
        </Button>
      </Form>
    </Container>
  );
}

export default PostJob;
