// src/BrowseJobs.js
import React from "react";
import JobList from "./JobList";
import { Container } from "react-bootstrap";

const BrowseJobs = ({ walletData }) => {
  return (
    <Container className="my-5 p-4">
      <h2 className="text-center mb-4">Browse Jobs</h2>
      <JobList walletData={walletData} />
    </Container>
  );
};

export default BrowseJobs;
