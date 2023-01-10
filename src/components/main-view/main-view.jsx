import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./main-view.scss";

export const MainView = () => {
  // Declare state variables to hold movies, user and token data, and a loading indicator
  const [movies, setMovies] = useState([]);
  // Get stored user and token data from local storage
  const storedToken = localStorage.getItem("token");
  // Set initial values for user and token using stored data, or null if not available
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [loading, setLoading] = useState(true);

  // Fetch movie data when the token changes
  useEffect(() => {
    // If there is no token, return early
    if (!token) {
      return;
    }
    getMovies()
    // Only re-run this effect if the token changes
  }, [token]);

  useEffect(() => {
    if(!user) {
      return
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    getUser(storedUser.Username)
  })

  const getMovies = () => {
     // Fetch movie data when authorized
     fetch("https://my-flix-db-jd.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json()) // Convert the response to JSON
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
            isFavorite: false
          };
        });

        // Update the movies state with the newly formatted data
        setMovies(moviesFromApi);
        // Set loading to false once the data has been fetched
        setLoading(false);
      })
      .catch((error) => {
        // Display an alert if there is an error
        window.alert("An error occurred: " + error);
        // Set loading to false if there is an error
        setLoading(false);
      });
  }
   // Function to add or remove the movie as a favorite
  const toggleFavorite = (movieId, isFavorite) => {
    // Send a POST or DELETE request to the server
    const method = isFavorite ? "DELETE" : "POST";
    fetch(
      `https://my-flix-db-jd.herokuapp.com/users/${
        JSON.parse(localStorage.getItem("user")).Username
      }/movies/${encodeURIComponent(movieId)}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    ).then(res => res.json())
      .then((response) => {
        setUser(response)
        localStorage.setItem("user", JSON.stringify(response))
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getUser = (username) => {
    fetch(`https://my-flix-db-jd.herokuapp.com/users/${username}`, {
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

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }}
      />
      <Row>
        <Routes>
          {/* renders the SignupView component if the user is not logged in, otherwise redirects to root path */}
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />

          {/* renders the LoginView component if the user is not logged in, otherwise redirects to root path. onLoggedIn prop is a function that sets the user and token when called. setLoading prop is a function that sets the loading state */}
          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                      }}
                      setLoading={setLoading}
                    />
                  </Col>
                )}
              </>
            }
          />
          {/* renders the MovieView component if the user is logged in and the loading state is false, otherwise redirects to the /login path or displays a message */}
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : loading ? (
                  <div>Loading...</div>
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView movies={movies} />
                  </Col>
                )}
              </>
            }
          />
          {/* renders movie cards if the user is logged in and the loading state is false, otherwise redirects to the /login path or displays a message */}
          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : loading ? (
                  <div>Loading...</div>
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {movies.map((movie) => (
                      <Col className="mt-4" md={3} key={movie.id}>
                        <MovieCard movie={movie} 
                              isFavorite={user.FavoriteMovies.includes(movie.id)} 
                              toggleFavorite={(isFavorite) => toggleFavorite(movie.id, isFavorite)}
                              />
                      </Col>
                    ))}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {/* Use a guard to only allow logged-in users to access the profile view */}
                {user ? (
                  <ProfileView  />
                ) : (
                  <Navigate to="/login" />
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
