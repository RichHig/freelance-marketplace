// src/Profile.js
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

const Profile = ({ walletData }) => {
  // State for profile fields
  const [name, setName] = useState("");
  const [role, setRole] = useState(""); // 'freelancer' or 'client'
  const [bio, setBio] = useState("");
  // profileImage will hold a Base64 string of the image
  const [profileImage, setProfileImage] = useState("");
  const [saved, setSaved] = useState(false);

  // Load saved profile data from localStorage on mount
  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (storedProfile) {
      setName(storedProfile.name || "");
      setRole(storedProfile.role || "");
      setBio(storedProfile.bio || "");
      setProfileImage(storedProfile.profileImage || "");
    }
  }, []);

  // Handle file input change: convert the file to a Base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile data (including the Base64 image) to localStorage
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const profileData = { name, role, bio, profileImage };
    localStorage.setItem("profileData", JSON.stringify(profileData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000); // reset the saved flag after 3 seconds
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Your Profile</h2>
          <p>
            <strong>Wallet Address:</strong> {walletData.signer.address}
          </p>
          <Form onSubmit={handleSaveProfile}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="profileName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="profileRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select your role</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="client">Client</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group controlId="profileBio" className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="profileImage" className="mb-3">
              <Form.Label>Upload Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Profile
            </Button>
            {saved && <span className="text-success ms-3">Profile saved!</span>}
          </Form>
          {profileImage && (
            <div className="mt-4">
              <h5>Your Profile Picture:</h5>
              <img
                src={profileImage}
                alt="Profile"
                className="img-fluid rounded"
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
