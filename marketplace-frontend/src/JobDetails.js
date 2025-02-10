// src/JobDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { ethers } from "ethers";

const JobDetails = ({ walletData }) => {
  const { jobId } = useParams(); // get jobId from URL
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidIndexToAccept, setBidIndexToAccept] = useState("");
  const [bidAmountToAccept, setBidAmountToAccept] = useState("");
  const [ratingScore, setRatingScore] = useState("");
  const [loading, setLoading] = useState(false);

  // Zero address to compare against
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        // Get job details using jobId (convert to number if necessary)
        const jobData = await walletData.marketplaceContract.jobs(jobId);
        setJob(jobData);

        // Fetch bids for this job by iterating until we hit an empty (zero) bid.
        const fetchedBids = [];
        // We'll try a maximum of 20 bids. In production, you'd have a proper bid count.
        for (let i = 0; i < 20; i++) {
          const bid = await walletData.marketplaceContract.jobBids(jobId, i);
          // If the freelancer address is zero, assume no more bids.
          if (bid.freelancer === zeroAddress) break;
          fetchedBids.push(bid);
        }
        setBids(fetchedBids);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }
    if (walletData && jobId) {
      fetchJobDetails();
    }
  }, [walletData, jobId]);

  // Handler for accepting a bid
  const handleAcceptBid = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const parsedBidAmount = ethers.parseEther(bidAmountToAccept);
      const tx = await walletData.marketplaceContract.acceptBid(
        jobId,
        bidIndexToAccept,
        { value: parsedBidAmount }
      );
      await tx.wait();
      alert("Bid accepted successfully!");
      // Reload to update job details
      window.location.reload();
    } catch (error) {
      console.error("Error accepting bid:", error);
      alert("Error accepting bid. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for releasing payment
  const handleReleasePayment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await walletData.marketplaceContract.releasePayment(jobId);
      await tx.wait();
      alert("Payment released successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error releasing payment:", error);
      alert("Error releasing payment. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for rating the freelancer
  const handleRateFreelancer = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await walletData.marketplaceContract.rateFreelancer(
        jobId,
        ratingScore
      );
      await tx.wait();
      alert("Rating submitted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return <div>Loading job details...</div>;
  }

  // Convert BigNumber values to strings for display
  const budgetString = job.budget.toString();
  const escrowAmountString = job.escrowAmount.toString();
  const isJobOpen = job.isOpen;
  const clientAddress = job.client;
  const acceptedFreelancer = job.acceptedFreelancer;

  return (
    <Container className="my-5">
      <h2>Job Details (ID: {job.id.toString()})</h2>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Card.Title>{job.description}</Card.Title>
          <Card.Text>
            <strong>Budget:</strong> {budgetString} wei
            <br />
            <strong>Status:</strong> {isJobOpen ? "Open" : "Closed"}
            <br />
            <strong>Client:</strong> {clientAddress}
            <br />
            {acceptedFreelancer !== zeroAddress && (
              <span>
                <strong>Accepted Freelancer:</strong> {acceptedFreelancer}
              </span>
            )}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3>Bids</h3>
      {bids.length === 0 ? (
        <p>No bids for this job yet.</p>
      ) : (
        bids.map((bid, index) => (
          <Card key={index} className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Text>
                <strong>Bid Index:</strong> {index}
                <br />
                <strong>Freelancer:</strong> {bid.freelancer}
                <br />
                <strong>Bid Amount:</strong> {bid.bidAmount.toString()} wei
                <br />
                <strong>Proposal:</strong> {bid.proposal}
                <br />
                <strong>Timestamp:</strong>{" "}
                {new Date(bid.timestamp * 1000).toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Show client actions only if the connected account is the job's client */}
      {walletData.signer.address.toLowerCase() ===
        clientAddress.toLowerCase() && (
        <>
          {/* If job is still open and no bid accepted, show Accept Bid form */}
          {isJobOpen && bids.length > 0 && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4>Accept a Bid</h4>
                <Form onSubmit={handleAcceptBid}>
                  <Form.Group controlId="acceptBidIndex" className="mb-3">
                    <Form.Label>Bid Index to Accept</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter bid index"
                      value={bidIndexToAccept}
                      onChange={(e) => setBidIndexToAccept(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="acceptBidAmount" className="mb-3">
                    <Form.Label>Bid Amount (in ETH)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter bid amount"
                      value={bidAmountToAccept}
                      onChange={(e) => setBidAmountToAccept(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Accept Bid"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* If a bid has been accepted (job is closed and escrow > 0), show Release Payment button */}
          {acceptedFreelancer !== zeroAddress && escrowAmountString !== "0" && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h4>Release Payment</h4>
                <Button
                  variant="warning"
                  onClick={handleReleasePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Release Payment"}
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* If payment is released (escrow is 0) and job is accepted and not yet rated, show Rate Freelancer form */}
          {acceptedFreelancer !== zeroAddress &&
            escrowAmountString === "0" &&
            !job.rated && (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h4>Rate Freelancer</h4>
                  <Form onSubmit={handleRateFreelancer}>
                    <Form.Group controlId="ratingScore" className="mb-3">
                      <Form.Label>Score (1-5)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter rating score"
                        value={ratingScore}
                        onChange={(e) => setRatingScore(e.target.value)}
                        required
                        min="1"
                        max="5"
                      />
                    </Form.Group>
                    <Button variant="info" type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Submit Rating"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            )}
        </>
      )}
    </Container>
  );
};

export default JobDetails;
