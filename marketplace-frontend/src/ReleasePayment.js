// src/ReleasePayment.js
import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function ReleasePayment({ walletData }) {
  const [jobId, setJobId] = useState("");

  const handleRelease = async (e) => {
    e.preventDefault();
    try {
      const tx = await walletData.marketplaceContract.releasePayment(jobId);
      await tx.wait();
      alert("Payment released successfully!");
      setJobId("");
    } catch (error) {
      console.error(error);
      alert("Error releasing payment. Check console for details.");
    }
  };

  return (
    <Container className="my-4">
      <h2>Release Payment</h2>
      <Form onSubmit={handleRelease}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="releaseJobId">
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
        </Row>
        <Button variant="warning" type="submit" className="mt-3">
          Release Payment
        </Button>
      </Form>
    </Container>
  );
}

export default ReleasePayment;
