// src/JobCard.js
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function JobCard({ job }) {
  const jobId = job.id.toString();

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>Job ID: {jobId}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {job.description} <br />
          <strong>Budget:</strong> {job.budget.toString()} wei <br />
          <strong>Status:</strong> {job.isOpen ? "Open" : "Closed"}
        </Card.Text>
        <Button as={Link} to={`/job/${jobId}`} variant="primary" size="sm">
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default JobCard;
