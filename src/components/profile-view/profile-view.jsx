import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const ProfileView = () => {
  // Declare state variables for the form inputs and the token
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteMoviesInput, setFavoriteMoviesInput] = useState("");

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

    // Send a PUT request to the server with the updated form data
    fetch(`https://my-flix-db-jd.herokuapp.com/users/${username}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      // If the request was successful
      if (response.ok) {
        // Send a request to the server to generate a new token for the user
        fetch(
          `https://my-flix-db-jd.herokuapp.com/users/${username}/generate-new-token`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((response) => {
          // If the request was successful, store the new token in local storage
          if (response.ok) {
            response.json().then((data) => {
              console.log("New token: ", data.newToken);
              localStorage.setItem("token", data.newToken);
            });
          }
        });
        alert("Profile update successful");
        setUsername(username);
        setPassword(password);

        setEmail(email);
        setBirthday(birthday);
      }
      // If the request failed, show an alert
      else {
        alert("Profile update failed");
      }
    });
  };

  // Render the form
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

      <Button className="my-4" variant="primary" type="submit">
        Update Profile
      </Button>

      <Form.Group controlId="formFavoriteMovies">
        <Form.Label>Add Favorite Movie:</Form.Label>
        <Form.Control
          type="text"
          value={favoriteMoviesInput}
          onChange={(e) => setFavoriteMoviesInput(e.target.value)}
        />
        <Button
          className="my-2"
          variant="primary"
          onClick={() => {
            setFavoriteMovies([...favoriteMovies, favoriteMoviesInput]);
            setFavoriteMoviesInput("");
          }}
        >
          Add Movie
        </Button>
      </Form.Group>

      <Form.Group controlId="formFavoriteMoviesList">
        <Form.Label>Favorite Movies:</Form.Label>
        <ul>
          {favoriteMovies.map((movie, index) => (
            <li key={index}>
              {movie}
              <Button
                className="mx-2"
                variant="secondary"
                onClick={() => {
                  setFavoriteMovies(
                    favoriteMovies.filter((_, i) => i !== index)
                  );
                }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </Form.Group>
    </Form>
  );
};
