// src/PostJobPage.js
import React from "react";
import PostJob from "./PostJob";
import { Container } from "react-bootstrap";

const PostJobPage = ({ walletData }) => {
  return (
    <Container className="my-5 p-4">
      <h2 className="text-center mb-4">Post a New Job</h2>
      <PostJob walletData={walletData} />
    </Container>
  );
};

export default PostJobPage;
