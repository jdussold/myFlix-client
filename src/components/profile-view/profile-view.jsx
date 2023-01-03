import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

export const ProfileView = () => {
  // Declare state variables for the form inputs, the token, and the displayForm state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(Array(8).fill("*").join(""));
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [originalPassword, setOriginalPassword] = useState("");

  // Use effect hook to retrieve the current user's information from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.Username);
      setOriginalPassword(user.Password);
      setEmail(user.Email);
      // Parse the birthday string and format it as yyyy-MM-dd
      const date = new Date(user.Birthday);
      setBirthday(date.toISOString().substring(0, 10));
    }
  }, []); // The empty array ensures that this effect only runs on mount

  // Event handler for when the form is submitted
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Check if password field is filled out
    if (password === Array(8).fill("*").join("")) {
      alert("Password is required.");
      return;
    }

    // Create an object with the form data
    const data = {
      Username: username,
      Password:
        password === Array(8).fill("*").join("") ? originalPassword : password,
      Email: email,
      Birthday: birthday,
    };

    // Send a PUT request to the server with the updated form data
    fetch(
      `https://my-flix-db-jd.herokuapp.com/users/${
        JSON.parse(localStorage.getItem("user")).Username
      }`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then((response) => {
      // If the request was successful
      if (response.ok) {
        alert(
          "Profile update successful.  Please logout and log back in to see the updated information."
        );
        setUsername(username);
        setPassword(password);
        setEmail(email);
        setBirthday(birthday);
        setUpdateSuccess(true);
        setDisplayForm(false);
      }
      // If the request failed, show an alert
      else {
        alert("Profile update failed");
        setUpdateSuccess(false);
      }
    });
  };

  // Render the form or the current user information
  return (
    <div>
      {updateSuccess && (
        <Row>
          <Col md={{ span: 12 }}>
            <p style={{ color: "red" }}>
              Profile information has been recently updated. Please log out and
              back in to see the updated information.
            </p>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} style={{ marginTop: "20px" }}>
          {/* Add a button that allows the user to toggle the form */}
          <Button
            onClick={() => setDisplayForm(!displayForm)}
            style={{ marginRight: "auto", marginBottom: "10px" }}
          >
            {displayForm ? "Cancel" : "Edit Profile"}
          </Button>
        </Col>
        {displayForm ? (
          <Col md={6} style={{ marginTop: "20px" }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength="5"
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBirthday">
                <Form.Label>Birthday:</Form.Label>
                <Form.Control
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </Form.Group>

              <Button className="my-4" variant="primary" type="submit">
                Update Profile
              </Button>
            </Form>
          </Col>
        ) : (
          <>
            <Col md={6} style={{ marginTop: "20px" }}>
              {/* Display the current user information */}
              <p>
                <strong>Username:</strong>{" "}
                <span style={{ float: "right" }}>
                  {JSON.parse(localStorage.getItem("user")).Username}
                </span>
              </p>
              <p>
                <strong>Password:</strong>{" "}
                <span style={{ float: "right" }}>********</span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span style={{ float: "right" }}>
                  {JSON.parse(localStorage.getItem("user")).Email}
                </span>
              </p>
              <p>
                <strong>Birthday:</strong>{" "}
                <span style={{ float: "right" }}>
                  {new Date(JSON.parse(localStorage.getItem("user")).Birthday)
                    .toISOString()
                    .substring(0, 10)}
                </span>
              </p>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};
