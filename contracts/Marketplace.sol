// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    // Global counter for unique job IDs.
    uint public jobCount;

    // Structure to hold job details.
    struct Job {
        uint id;
        address payable client;
        string description;
        uint budget;
        bool isOpen; // true if the job is open for bids, false otherwise.
        address payable acceptedFreelancer;
        uint escrowAmount; // Funds held in escrow.
        bool rated; // Indicates if the job has been rated.
    }

    // Structure to hold bid details.
    struct Bid {
        address freelancer;
        uint bidAmount;
        string proposal;
        uint timestamp;
    }

    // Structure to store ratings for a freelancer.
    struct Rating {
        uint totalScore;
        uint ratingCount;
    }

    // Mappings for jobs and bids.
    mapping(uint => Job) public jobs;
    mapping(uint => Bid[]) public jobBids;

    // Mapping to track each freelancer's ratings.
    mapping(address => Rating) public freelancerRatings;

    // Events to log actions.
    event JobPosted(uint jobId, address client, string description, uint budget);
    event BidSubmitted(uint jobId, address freelancer, uint bidAmount);
    event JobAccepted(uint jobId, address freelancer, uint agreedBidAmount);
    event PaymentReleased(uint jobId, address freelancer, uint amountReleased);
    event RatingSubmitted(uint jobId, address freelancer, uint score);

    /// @notice Allows a client to post a new job.
    function postJob(string memory _description, uint _budget) public {
        require(_budget > 0, "Budget must be greater than zero");
        jobCount++;
        jobs[jobCount] = Job(
            jobCount,
            payable(msg.sender),
            _description,
            _budget,
            true,                   // Job is open for bidding.
            payable(address(0)),    // No freelancer accepted yet.
            0,                      // No funds in escrow initially.
            false                   // Not yet rated.
        );
        emit JobPosted(jobCount, msg.sender, _description, _budget);
    }

    /// @notice Allows a freelancer to submit a bid for a specific job.
    function submitBid(uint _jobId, uint _bidAmount, string memory _proposal) public {
        require(_jobId > 0 && _jobId <= jobCount, "Invalid job ID");
        Job storage job = jobs[_jobId];
        require(job.isOpen, "Job is not open for bids");
        require(msg.sender != job.client, "Client cannot bid on their own job");

        Bid memory newBid = Bid({
            freelancer: msg.sender,
            bidAmount: _bidAmount,
            proposal: _proposal,
            timestamp: block.timestamp
        });

        jobBids[_jobId].push(newBid);
        emit BidSubmitted(_jobId, msg.sender, _bidAmount);
    }

    /// @notice Allows the client to accept a bid and initiate escrow.
    /// @dev The client must send ETH equal to the bid amount.
    function acceptBid(uint _jobId, uint _bidIndex) public payable {
        require(_jobId > 0 && _jobId <= jobCount, "Invalid job ID");
        Job storage job = jobs[_jobId];
        require(job.isOpen, "Job is not open");
        require(msg.sender == job.client, "Only the client can accept a bid");
        require(_bidIndex < jobBids[_jobId].length, "Invalid bid index");

        Bid storage selectedBid = jobBids[_jobId][_bidIndex];
        require(msg.value == selectedBid.bidAmount, "Sent value must equal bid amount");

        // Accept the bid.
        job.acceptedFreelancer = payable(selectedBid.freelancer);
        job.isOpen = false;
        job.escrowAmount = msg.value;

        emit JobAccepted(_jobId, selectedBid.freelancer, selectedBid.bidAmount);
    }

    /// @notice Allows the client to release escrowed funds to the freelancer after job completion.
    function releasePayment(uint _jobId) public {
        require(_jobId > 0 && _jobId <= jobCount, "Invalid job ID");
        Job storage job = jobs[_jobId];
        require(msg.sender == job.client, "Only the client can release payment");
        require(job.acceptedFreelancer != address(0), "No freelancer has been accepted");
        require(job.escrowAmount > 0, "No funds in escrow");

        uint amount = job.escrowAmount;
        job.escrowAmount = 0; // Reset escrow before transfer (prevents reentrancy).
        job.acceptedFreelancer.transfer(amount);

        emit PaymentReleased(_jobId, job.acceptedFreelancer, amount);
    }

    /// @notice Allows the client to rate the freelancer after payment is released.
    /// @param _jobId The ID of the job.
    /// @param score The rating score (e.g., between 1 and 5).
    function rateFreelancer(uint _jobId, uint score) external {
        require(_jobId > 0 && _jobId <= jobCount, "Invalid job ID");
        Job storage job = jobs[_jobId];
        require(job.acceptedFreelancer != address(0), "No freelancer assigned");
        require(job.escrowAmount == 0, "Payment not released");
        require(msg.sender == job.client, "Only the client can rate");
        require(score >= 1 && score <= 5, "Score must be between 1 and 5");
        require(job.rated == false, "Job already rated");

        // Update the freelancer's rating.
        freelancerRatings[job.acceptedFreelancer].totalScore += score;
        freelancerRatings[job.acceptedFreelancer].ratingCount += 1;
        job.rated = true;

        emit RatingSubmitted(_jobId, job.acceptedFreelancer, score);
    }
}
