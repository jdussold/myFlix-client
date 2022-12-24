import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const LoginView = ({ onLoggedIn, setLoading }) => {
  // Declare a state variable called "username" and a function to update it
  const [username, setUsername] = useState("");
  // Declare a state variable called "password" and a function to update it
  const [password, setPassword] = useState("");

  // This function is called when the form is submitted
  const handleSubmit = (event) => {
    // this prevents the default behavior of the form which is to reload the entire page
    event.preventDefault();

    // Create an object with the username and password
    const data = {
      Username: username,
      Password: password,
    };

    // Make a POST request to the login endpoint with the data
    fetch("https://my-flix-db-jd.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Login response: ", data);
        // If the server returns a user object, store the user and token in local storage and call the "onLoggedIn" function
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);
          onLoggedIn(data.user, data.token);
        } else {
          alert("No such user");
        }
      })
      .catch((e) => {
        alert("Something went wrong");
      });
  };

  // Render the form with inputs for the username and password and a submit button
  return (
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
      <Button className="my-4" variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};
