import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({
  user,
  onLoggedOut,
  handleSearchInput,
  handleFilterSelection,
}) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        {/* Setting the brand name to MyFlix, with a link to the home page */}
        <Navbar.Brand style={{ color: "#FFA400" }} as={Link} to="/">
          MyFlix
        </Navbar.Brand>
        {/* Toggling navigation bar for smaller screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* If no user is logged in then display the Login and Signup links */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {/* If a user is logged in then display the Home, Profile, and Logout links */}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} onClick={onLoggedOut}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
          {/* If a user is logged in then display search bar */}
          {user && (
            <Form inline className="d-flex">
              {/*Input field for searching */}
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2 mx-2 orange-border"
                onChange={handleSearchInput}
              />
              {/* Dropdown for filter selection*/}
              <FormControl
                as="select"
                onChange={handleFilterSelection}
                className="mx-2 orange-border"
              >
                <option value="title">Title</option>
                <option value="genre">Genre</option>
                <option value="director">Director</option>
              </FormControl>
            </Form>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
