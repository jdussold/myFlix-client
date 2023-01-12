import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Card } from "react-bootstrap";
import logo from "../../img/logo-color.svg";

export const SignupView = ({ onLoggedIn }) => {
  // Declare state variables for the form inputs and the token
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [token, setToken] = useState("");

  // Event handler for when the form is submitted
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Create an object with the form data
    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    // Send a POST request to the server with the form data
    fetch("https://my-flix-db-jd.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      // If the request was successful, log the user in
      if (response.ok) {
        // Send a request to the /login endpoint with the user's credentials
        fetch("https://my-flix-db-jd.herokuapp.com/login", {
          method: "POST",
          body: JSON.stringify({
            Username: username,
            Password: password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            // If the request was successful, store the token and user data in local storage and update the component's state
            if (response.ok) {
              alert("Signup and login successful");
              response.json().then((data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setToken(data.token);
                // Call the "onLoggedIn" function passed in as a prop from the MainView component, passing in the user and token data
                onLoggedIn(data.user, data.token);
              });
            }
            // If the request failed, show an alert
            else {
              alert("Signup failed");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  // Render the form
  return (
    <Card
      className="mt-4 center-card"
      style={{ width: "18rem", backgroundColor: "#1F2941" }}
    >
      <Card.Body>
        <img src={logo} alt="Logo" className="logo-img" />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
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
              required
            />
          </Form.Group>
          <div className="text-center">
            <Button className="my-3" variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <a href="/login">
              <strong>LOG IN</strong>
            </a>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};
