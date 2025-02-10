// src/JobList.js
import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { Container, Row, Col } from "react-bootstrap";

function JobList({ walletData }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        console.log("Fetching jobs...");
        console.log("Contract address:", walletData.marketplaceContract.target);

        // Try to get the job count
        let jobCount;
        try {
          jobCount = await walletData.marketplaceContract.jobCount();
          console.log("Raw job count:", jobCount);
        } catch (error) {
          console.error("Error fetching job count:", error);
          throw new Error(
            "Failed to fetch job count. Please check your contract connection."
          );
        }

        const jobList = [];
        // Convert BigNumber to number and handle the case where jobCount might be 0
        const count = Number(jobCount) || 0;
        console.log("Processed job count:", count);

        // If there are jobs, fetch them
        if (count > 0) {
          for (let i = 1; i <= count; i++) {
            try {
              console.log(`Fetching job ${i}...`);
              const job = await walletData.marketplaceContract.jobs(i);
              console.log(`Job ${i} details:`, job);

              jobList.push({
                id: job.id.toString(),
                client: job.client,
                description: job.description,
                budget: job.budget.toString(),
                isOpen: job.isOpen,
                acceptedFreelancer: job.acceptedFreelancer,
                escrowAmount: job.escrowAmount.toString(),
                rated: job.rated,
              });
            } catch (error) {
              console.error(`Error fetching job ${i}:`, error);
            }
          }
        }

        console.log("Final job list:", jobList);
        setJobs(jobList);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchJobs:", error);
        setError(error.message);
        setLoading(false);
      }
    }

    if (walletData && walletData.marketplaceContract) {
      fetchJobs();
    }
  }, [walletData]);

  if (loading) {
    return (
      <Container>
        <p>Loading jobs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-center mb-4">Job Listings</h2>
      {jobs.length === 0 ? (
        <p className="text-center">No jobs posted yet.</p>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col key={job.id} md={4} className="mb-4">
              <JobCard job={job} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default JobList;
