// src/RateFreelancer.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function RateFreelancer({ walletData }) {
  const [jobId, setJobId] = useState("");
  const [score, setScore] = useState("");

  const handleRating = async (e) => {
    e.preventDefault();
    try {
      const tx = await walletData.marketplaceContract.rateFreelancer(
        jobId,
        score
      );
      await tx.wait();
      alert("Rating submitted successfully!");
      setJobId("");
      setScore("");
    } catch (error) {
      console.error(error);
      alert("Error submitting rating. Check console for details.");
    }
  };

  return (
    <Container className="my-4">
      <h2>Rate Freelancer</h2>
      <Form onSubmit={handleRating}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="rateJobId">
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
          <Col md={6}>
            <Form.Group controlId="ratingScore">
              <Form.Label>Score (1-5)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter rating score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="1"
                max="5"
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="info" type="submit" className="mt-3">
          Submit Rating
        </Button>
      </Form>
    </Container>
  );
}

export default RateFreelancer;
