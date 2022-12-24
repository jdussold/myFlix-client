import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col, Button } from "react-bootstrap";
import "./main-view.scss";

export const MainView = () => {
  // Declare state variables to hold movies, user and token data, and a loading indicator
  const [movies, setMovies] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Define toggleSignupModal and toggleLoginModal functions
  const toggleSignupModal = () => {
    setSignupModalOpen(true);
    setLoginModalOpen(false);
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(true);
    setSignupModalOpen(false);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    // Fetch movie data when authorized
    fetch("https://my-flix-db-jd.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        // Map movie data from the API to a new format
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.Title,
            image: movie.ImagePath,
            description: movie.Description,
            genre: movie.Genre.Name,
            director: movie.Director.Name,
          };
        });

        setMovies(moviesFromApi);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        window.alert("An error occurred: " + error);
        setLoading(false); // Set loading to false when an error occurs
      });
  }, [token]);

  // Render a loading indicator
  const LoadingIndicator = () => {
    return <div>Loading...</div>;
  };

  return (
    <Row className="my-4 justify-content-md-center">
      {!user ? (
        // If the user is not logged in, render the login and signup buttons
        <Col md={5}>
          <Row className="my-4 justify-content-md-center">
            <Col xs="auto">
              <Button onClick={toggleLoginModal} variant="primary">
                Login
              </Button>
            </Col>
          </Row>
          <Row className="my-4 justify-content-md-center">
            <Col xs="auto">or</Col>
          </Row>
          <Row className="my-4 justify-content-md-center">
            <Col xs="auto">
              <Button onClick={toggleSignupModal} variant="primary">
                Signup
              </Button>
            </Col>
          </Row>
          {/* If the loginModalOpen or signupModalOpen flag is true, render the LoginView or SignupView component */}
          {loginModalOpen && (
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
              }}
              setLoading={setLoading}
            />
          )}
          {signupModalOpen && <SignupView />}
        </Col>
      ) : loading ? (
        // If the user is logged in and the data is still loading, render the LoadingIndicator
        <LoadingIndicator />
      ) : movies.length === 0 ? (
        // If the user is logged in, the data is finished loading, and the movies array is empty, render a message saying the list is empty
        <div>The list is empty!</div>
      ) : //If a movie has been selected, render the MovieView component
      selectedMovie ? (
        <Col md={8}>
          <MovieView
            movie={selectedMovie}
            onBackClick={() => setSelectedMovie(null)}
          />
        </Col>
      ) : (
        //If none of the above conditions are met, render the movie cards and a logout button
        <>
          {movies.map((movie) => (
            <Col className="mb-5" key={movie.id} md={3}>
              <MovieCard
                key={movie._id}
                movie={movie}
                onMovieClick={(newSelectedMovie) => {
                  setSelectedMovie(newSelectedMovie);
                }}
              />
            </Col>
          ))}
          <Row className="justify-content-center">
            <Col xs="auto">
              <button
                onClick={() => {
                  setUser(null);
                  setToken(null);
                  localStorage.clear();
                }}
                className="btn btn-primary"
              >
                Logout
              </button>
            </Col>
          </Row>
        </>
      )}
    </Row>
  );
};
