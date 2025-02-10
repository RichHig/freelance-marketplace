// src/HeroSection.js
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "./HeroSection.css"; // Create this file for custom styles
// Import the image
import heroImage from "./assets/images/Hero.jpg";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="display-4">Find the best freelance services</h1>
            <p className="lead">
              Browse talented professionals to get your job done with speed and
              quality.
            </p>
            <Link to="/profile">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
          </Col>
          <Col md={6}>
            {/* Update the image source */}
            <img
              src={heroImage}
              alt="Freelance services"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>1. Post a Job</Card.Title>
                  <Card.Text>
                    Describe your project and your budget in ETH.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>2. Freelancers Bid On Your Job</Card.Title>
                  <Card.Text>
                    Browse profiles and portfolios of skilled professionals.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>3. Collaborate</Card.Title>
                  <Card.Text>
                    Accept Bids and Work together seamlessly on our platform.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container className="text-center">
          <h2 className="mb-4">Ready to get started?</h2>
          <p className="lead mb-4">
            Join our global community of freelancers and businesses today!
          </p>
          <Link to="/browse-jobs">
            <Button variant="primary" size="lg" className="me-3">
              Find Work
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="success" size="lg">
              Hire Freelancers
            </Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}

export default HeroSection;
