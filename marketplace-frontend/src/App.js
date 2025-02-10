// src/App.js
import React, { useEffect, useState } from "react";
import { connectWallet } from "./ethereum";
import NavigationBar from "./NavigationBar";
import Home from "./Home";
import BrowseJobs from "./BrowseJobs";
import PostJobPage from "./PostJobPage";
import Profile from "./Profile";
import JobDetails from "./JobDetails";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    async function init() {
      const data = await connectWallet();
      setWalletData(data);
    }
    init();
  }, []);

  // Function to "disconnect" by clearing the wallet data from the state
  const disconnect = () => {
    setWalletData(null);
    // Optionally, force a page reload to simulate disconnecting:
    // window.location.reload();
  };

  if (!walletData) {
    return (
      <Container className="text-center mt-5">
        <h3>Please connect your wallet to use FreelanceHub.</h3>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Connect Wallet
        </button>
      </Container>
    );
  }

  return (
    <div>
      <NavigationBar
        connectedAccount={walletData.signer.address}
        disconnect={disconnect}
      />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/browse-jobs"
            element={<BrowseJobs walletData={walletData} />}
          />
          <Route
            path="/post-job"
            element={<PostJobPage walletData={walletData} />}
          />
          <Route
            path="/profile"
            element={<Profile walletData={walletData} />}
          />
          <Route
            path="/job/:jobId"
            element={<JobDetails walletData={walletData} />}
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
