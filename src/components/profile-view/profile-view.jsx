import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { API_BASE_URL } from "../../config";

export const ProfileView = ({ movies }) => {
  // Declare state variables for the form inputs, the token, and the displayForm state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formPassword, setFormPassword] = useState("********");
  // Declare state variables for the modal
  const [showModal, setShowModal] = useState(false);
  const [modalPassword, setModalPassword] = useState("");
  // Declare a state variable to store whether the "Delete Account" button has been clicked
  const [deleteClicked, setDeleteClicked] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [userFavoriteIds, setUserFavoriteIds] = useState(
    user?.FavoriteMovies ?? []
  );

  // Use effect hook to retrieve the current user's information from localStorage
  useEffect(() => {
    if (user) {
      getUser(user.Username);
    }
  }, []); // The empty array ensures that this effect only runs on mount

  // set User data from server
  const setUser = (userData) => {
    setUsername(userData.Username);
    setPassword(userData.Password);
    setEmail(userData.Email);
    // Parse the birthday string and format it as yyyy-MM-dd
    const date = new Date(userData.Birthday);
    setBirthday(date.toISOString().substring(0, 10));
    setUserFavoriteIds(userData.FavoriteMovies ?? []);
  };

  // Fetch user from server
  const getUser = (username) => {
    fetch(`${API_BASE_URL}/users/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        // If the request was successful
        setUser(response);
      })
      .catch((error) => {
        alert("An error occurred while fetching your profile");
      });
  };

  // Event handler for when the form is submitted
  const handleSubmit = (event) => {
    console.log("handleSubmit called, deleteClicked:", deleteClicked);
    // Prevent the default refresh
    event.preventDefault();

    // Check if any of the form values have been changed from their default values or if the "Delete Account" button has been clicked
    if (
      username !== user.Username ||
      formPassword !== "********" ||
      email !== user.Email ||
      birthday !== user.Birthday ||
      deleteClicked
    ) {
      // If any of the form values have been changed or the "Delete Account" button has been clicked, show the modal to confirm the changes
      setShowModal(true);
    } else {
      // If none of the form values have been changed, show an alert
      alert("No changes have been made");
    }
  };
  // Event handler for when the "Confirm" button in the modal is clicked
  const handleModalConfirm = () => {
    // Re-authenticate by hitting /login with the user's current password.
    // If credentials are valid, proceed with the requested change; otherwise
    // alert and bail.
    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: user.Username,
        Password: modalPassword,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Incorrect password");
        }
        return res.json();
      })
      .then((response) => {
        // If the "Delete Account" button has been clicked, send a DELETE request to delete the user's account
        if (deleteClicked) {
          fetch(
            `${API_BASE_URL}/users/${
              JSON.parse(localStorage.getItem("user")).Username
            }`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
            .then((res) => res.json())
            .then((response) => {
              // If the DELETE request was successful, log the user out and remove their information from localStorage
              setShowModal(false);
              alert("Your account has been deleted");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location = "/login";
            })
            .catch((error) => {
              console.error(error);
              alert("An error occurred while deleting your account");
            });
        } else {
          // If the "Delete Account" button has not been clicked, create an object with the form data
          let data;
          if (formPassword === "********") {
            // If the password has not been updated from the default value, send an empty string as the password in the PUT request
            data = {
              Username: username,
              Password: "",
              Email: email,
              Birthday: birthday,
            };
          } else {
            // If the password has been updated, send the new password in the PUT request
            data = {
              Username: username,
              Password: formPassword,
              Email: email,
              Birthday: birthday,
            };
          }

          // Send a PUT request to the server with the updated form data to update the users information
          fetch(`${API_BASE_URL}/users/${user.Username}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          })
            .then((res) => res.json())
            .then((response) => {
              // If the request was successful

              alert("Profile update successful");
              //update state
              setUser(response);
              //update localStorage
              localStorage.setItem("user", JSON.stringify(response));
              setUpdateSuccess(true);
              setDisplayForm(false);
              setShowModal(false); // Hide the modal
            })
            .catch((error) => {
              console.error(error);
              alert("An error occurred while updating your profile");
              setUpdateSuccess(false);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        alert(
          error.message === "Incorrect password"
            ? "The password you entered is incorrect."
            : "An error occurred while verifying your password. Please try again."
        );
        setShowModal(false);
      });
  };

  const toggleFavorite = (movieId, isFavorite) => {
    // Send a DELETE request to the server if the movie is already marked as favorite, or a POST request if it is not yet marked as favorite
    const method = isFavorite ? "DELETE" : "POST";
    fetch(
      `${API_BASE_URL}/users/${
        JSON.parse(localStorage.getItem("user")).Username
      }/movies/${encodeURIComponent(movieId)}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        setUser(response);
        localStorage.setItem("user", JSON.stringify(response));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Derive the user's favorite movies from the global list (passed as a prop)
  // and the current set of FavoriteMovies ids. Avoids a duplicate /movies fetch.
  const favoriteMovies = movies
    .filter((movie) => userFavoriteIds.includes(movie.id))
    .sort((a, b) => (a.title > b.title ? 1 : -1));

  // Render the form or the current user information
  return (
    <div>
      {/* Displaying a message if the update was successful */}
      {updateSuccess && (
        <Row>
          <Col md={{ span: 12 }}>
            <p style={{ color: "red" }}>
              Profile information has been recently updated.
            </p>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} style={{ marginTop: "20px" }}>
          {/* Add a button that allows the user to toggle the form */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              onClick={() => setDisplayForm(!displayForm)}
              style={{ marginRight: "auto", marginBottom: "10px" }}
            >
              {displayForm ? "Cancel" : "Edit Profile"}
            </Button>
            {/* Showing delete account button only when form is displayed */}
            {displayForm && (
              <Button
                type="submit"
                variant="danger"
                onClick={(e) => {
                  console.log("Delete Account button clicked");
                  setDeleteClicked(true);
                  handleSubmit(e);
                }}
                style={{ marginRight: "auto", marginBottom: "10px" }}
              >
                Delete Account
              </Button>
            )}
          </div>
        </Col>

        {/* Toggling the form based on the value of 'displayForm' */}
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
                  placeholder="Enter new password"
                  defaultValue="********"
                  onChange={(e) => setFormPassword(e.target.value)}
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
              {/* Showing a modal to confirm changes */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Enter your current password to confirm your changes:</p>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleModalConfirm}>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>

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
                <span style={{ float: "right" }}>{username}</span>
              </p>
              <p>
                <strong>Password:</strong>{" "}
                <span style={{ float: "right" }}>********</span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span style={{ float: "right" }}>{email}</span>
              </p>
              <p>
                <strong>Birthday:</strong>{" "}
                <span style={{ float: "right" }}>{birthday}</span>
              </p>
            </Col>
            <div>
              <h2 style={{ color: "#FFA400" }}>Favorite Movies</h2>
              <Row>
                {favoriteMovies.map((movie) => (
                  <Col className="mt-4" md={3} key={movie.id}>
                    <MovieCard
                      movie={movie}
                      isFavorite={true}
                      toggleFavorite={(isFavorite) =>
                        toggleFavorite(movie.id, isFavorite)
                      }
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </>
        )}
      </Row>
    </div>
  );
};
