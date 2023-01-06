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
  const [passwordToUse, setPasswordToUse] = useState("");
  const [formPassword, setFormPassword] = useState("********");
  // Declare state variables for the modal
  const [showModal, setShowModal] = useState(false);
  const [modalPassword, setModalPassword] = useState("");

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
    // Prevent the default refresh
    event.preventDefault();

    // Check if any of the form values have been changed from their default values
    if (
      username !== JSON.parse(localStorage.getItem("user")).Username ||
      formPassword !== "********" ||
      email !== JSON.parse(localStorage.getItem("user")).Email ||
      birthday !== JSON.parse(localStorage.getItem("user")).Birthday
    ) {
      // If any of the form values have been changed, show the modal to confirm the changes
      setShowModal(true);
    } else {
      // If none of the form values have been changed, show an alert
      alert("No changes have been made");
    }
  };

  // Event handler for when the "Confirm" button in the modal is clicked
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
        // If the request was successful
        if (response.ok) {
          // passwords match
          // If the passwords match, create an object with the form data
          console.log(
            `formPassword value is currently set to: ${formPassword}`
          );
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
            // If the password has been updated, send the updated password in the PUT request
            data = {
              Username: username,
              Password: formPassword,
              Email: email,
              Birthday: birthday,
            };
          }
          console.log(`Sending password: ${password}`);

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
                "Profile update successful. Please logout and log back in to see the updated information."
              );
              setUsername(username);
              setPassword(password);
              setEmail(email);
              setBirthday(birthday);
              setUpdateSuccess(true);
              setDisplayForm(false);
              setShowModal(false); // Hide the modal
            }
            // If the request failed, show an alert
            else {
              alert(
                "There was an error updating your profile. Please try again."
              );
              setUpdateSuccess(false);
            }
          });
        } else {
          // passwords do not match
          alert("The password entered is incorrect. Please try again.");
          return;
        }
      })
      .catch((error) => {
        // There was an error in the request or the response was not 2xx
        console.error(error);
        alert(
          "An error occurred while verifying the password. Please try again."
        );
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
