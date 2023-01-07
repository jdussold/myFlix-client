import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";

export const ProfileView = () => {
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

  // Use effect hook to retrieve the current user's information from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.Username);
      setPassword(user.Password);
      setEmail(user.Email);
      // Parse the birthday string and format it as yyyy-MM-dd
      const date = new Date(user.Birthday);
      setBirthday(date.toISOString().substring(0, 10));
    }
  }, []); // The empty array ensures that this effect only runs on mount

  // Event handler for when the form is submitted
  const handleSubmit = (event) => {
    console.log("handleSubmit called, deleteClicked:", deleteClicked);
    // Prevent the default refresh
    event.preventDefault();

    // Check if any of the form values have been changed from their default values or if the "Delete Account" button has been clicked
    if (
      username !== JSON.parse(localStorage.getItem("user")).Username ||
      formPassword !== "********" ||
      email !== JSON.parse(localStorage.getItem("user")).Email ||
      birthday !== JSON.parse(localStorage.getItem("user")).Birthday ||
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
    // Send a request to the server to check if the entered password is correct
    fetch("https://my-flix-db-jd.herokuapp.com/verify-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: JSON.parse(localStorage.getItem("user")).Username,
        password: modalPassword,
      }),
    })
      .then((response) => {
        // If the request was successful and the entered password is correct
        if (response.ok) {
          // If the "Delete Account" button has been clicked, send a DELETE request to delete the user's account
          if (deleteClicked) {
            fetch(
              `https://my-flix-db-jd.herokuapp.com/users/${
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
              .then((response) => {
                // If the DELETE request was successful, log the user out and remove their information from localStorage
                if (response.ok) {
                  setShowModal(false);
                  alert("Your account has been deleted");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location = "/login";
                } else {
                  alert("An error occurred while deleting your account");
                }
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
            fetch(
              `https://my-flix-db-jd.herokuapp.com/users/${
                JSON.parse(localStorage.getItem("user")).Username
              }`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(data),
              }
            )
              .then((response) => {
                // If the request was successful
                if (response.ok) {
                  alert(
                    "Profile update successful. Please logout and log back in to see the updated information."
                  );
                  setUsername(username);
                  setPassword(password);
                  setEmail(email);
                  setBirthday(birthday);
                  setUpdateSuccess(true);
                  setDisplayForm(false);
                  setShowModal(false); // Hide the modal
                } else {
                  // If the request failed, show an alert
                  alert("An error occurred while updating your profile");
                  setUpdateSuccess(false);
                }
              })
              .catch((error) => {
                console.error(error);
                alert("An error occurred while updating your profile");
                setUpdateSuccess(false);
              });
          }
        } else {
          // If the entered password is incorrect, show an alert
          alert("The password entered is incorrect. Please try again.");
          setShowModal(false);
          return;
        }
      })
      .catch((error) => {
        // There was an error in the request or the response was not 2xx
        console.error(error);
        alert(
          "An error occurred while verifying the password. Please try again."
        );
        setShowModal(false);
        return;
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
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              onClick={() => setDisplayForm(!displayForm)}
              style={{ marginRight: "auto", marginBottom: "10px" }}
            >
              {displayForm ? "Cancel" : "Edit Profile"}
            </Button>
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
