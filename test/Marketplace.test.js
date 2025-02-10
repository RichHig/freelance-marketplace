const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function () {
  let marketplace;
  let marketplaceFactory;
  let client, freelancer, other;

  beforeEach(async function () {
    // Retrieve test accounts.
    [client, freelancer, other] = await ethers.getSigners();

    // Deploy a new instance of the Marketplace contract.
    marketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await marketplaceFactory.deploy();
  });

  it("should allow a client to post a job", async function () {
    const description = "Develop a blockchain-based platform";
    const budget = ethers.parseEther("1"); // Changed from ethers.utils.parseEther

    // Expect the JobPosted event to be emitted with the correct values.
    await expect(marketplace.connect(client).postJob(description, budget))
      .to.emit(marketplace, "JobPosted")
      .withArgs(1, client.address, description, budget);

    // Verify the job details.
    const job = await marketplace.jobs(1);
    expect(job.id).to.equal(1);
    expect(job.client).to.equal(client.address);
    expect(job.description).to.equal(description);
    expect(job.budget).to.equal(budget);
    expect(job.isOpen).to.equal(true);
  });

  it("should allow a freelancer to submit a bid", async function () {
    // First, a client posts a job.
    const description = "Develop a blockchain-based platform";
    const budget = ethers.parseEther("1"); // Changed from ethers.utils.parseEther
    await marketplace.connect(client).postJob(description, budget);

    // Freelancer submits a bid.
    const bidAmount = ethers.parseEther("0.8"); // Changed from ethers.utils.parseEther
    const proposal = "I can complete this project efficiently!";
    await expect(
      marketplace.connect(freelancer).submitBid(1, bidAmount, proposal)
    )
      .to.emit(marketplace, "BidSubmitted")
      .withArgs(1, freelancer.address, bidAmount);

    // Verify the bid is stored
    const bid = await marketplace.jobBids(1, 0); // Get first bid (index 0) for job ID 1
    expect(bid.freelancer).to.equal(freelancer.address);
    expect(bid.bidAmount).to.equal(bidAmount);
    expect(bid.proposal).to.equal(proposal);
    expect(bid.timestamp).to.not.equal(0); // Verify timestamp was set
  });

  it("should allow the client to rate the freelancer after payment is released", async function () {
    // Client posts a job.
    const description = "Develop a blockchain-based platform";
    const budget = ethers.parseEther("1");
    await marketplace.connect(client).postJob(description, budget);

    // Freelancer submits a bid.
    const bidAmount = ethers.parseEther("0.8");
    const proposal = "I can complete this project efficiently!";
    await marketplace.connect(freelancer).submitBid(1, bidAmount, proposal);

    // Client accepts the bid (with escrow).
    await marketplace.connect(client).acceptBid(1, 0, { value: bidAmount });

    // Client releases payment.
    await marketplace.connect(client).releasePayment(1);

    // Capture initial ratings for the freelancer.
    const initialRating = await marketplace.freelancerRatings(
      freelancer.address
    );
    expect(initialRating.totalScore).to.equal(0);
    expect(initialRating.ratingCount).to.equal(0);

    // Client rates the freelancer with a score of 5.
    await expect(marketplace.connect(client).rateFreelancer(1, 5))
      .to.emit(marketplace, "RatingSubmitted")
      .withArgs(1, freelancer.address, 5);

    // Verify that the freelancer's rating has been updated.
    const updatedRating = await marketplace.freelancerRatings(
      freelancer.address
    );
    expect(updatedRating.totalScore).to.equal(5);
    expect(updatedRating.ratingCount).to.equal(1);

    // Attempting to rate the same job again should revert.
    await expect(
      marketplace.connect(client).rateFreelancer(1, 4)
    ).to.be.revertedWith("Job already rated");
  });

  it("should allow a client to accept a bid and initiate escrow", async function () {
    // Client posts a job.
    const description = "Develop a blockchain-based platform";
    const budget = ethers.parseEther("1"); // Changed from ethers.utils.parseEther
    await marketplace.connect(client).postJob(description, budget);

    // Freelancer submits a bid.
    const bidAmount = ethers.parseEther("0.8"); // Changed from ethers.utils.parseEther
    const proposal = "I can complete this project efficiently!";
    await marketplace.connect(freelancer).submitBid(1, bidAmount, proposal);

    // Client accepts the bid by sending the exact bid amount as escrow.
    await expect(
      marketplace.connect(client).acceptBid(1, 0, { value: bidAmount })
    )
      .to.emit(marketplace, "JobAccepted")
      .withArgs(1, freelancer.address, bidAmount);

    // Verify the job details.
    const job = await marketplace.jobs(1);
    expect(job.acceptedFreelancer).to.equal(freelancer.address);
    expect(job.isOpen).to.equal(false);
    expect(job.escrowAmount).to.equal(bidAmount);
  });

  it("should allow the client to release payment to the freelancer", async function () {
    // Client posts a job.
    const description = "Develop a blockchain-based platform";
    const budget = ethers.parseEther("1"); // Changed from ethers.utils.parseEther
    await marketplace.connect(client).postJob(description, budget);

    // Freelancer submits a bid.
    const bidAmount = ethers.parseEther("0.8"); // Changed from ethers.utils.parseEther
    const proposal = "I can complete this project efficiently!";
    await marketplace.connect(freelancer).submitBid(1, bidAmount, proposal);

    // Client accepts the bid (with escrow).
    await marketplace.connect(client).acceptBid(1, 0, { value: bidAmount });

    // Capture freelancer's balance before releasing payment.
    const balanceBefore = await ethers.provider.getBalance(freelancer.address);

    // Client releases payment.
    await expect(marketplace.connect(client).releasePayment(1))
      .to.emit(marketplace, "PaymentReleased")
      .withArgs(1, freelancer.address, bidAmount);

    // Verify the freelancer's balance has increased by the bidAmount
    const balanceAfter = await ethers.provider.getBalance(freelancer.address);
    expect(balanceAfter - balanceBefore).to.equal(bidAmount);

    // Verify the escrow amount has been reset.
    const job = await marketplace.jobs(1);
    expect(job.escrowAmount).to.equal(0);
  });
});
