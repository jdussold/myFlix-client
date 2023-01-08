import React, { useEffect, useState } from "react";
//Import the PropTypes library
import PropTypes from "prop-types";
// Import the Button and Card components from the react-bootstrap library
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

//The MovieCard Function Component
// The component returns a Card element with an image, title, director, and a button
export const MovieCard = ({ movie }) => {
  // Add a new piece of state to track whether the movie is a favorite
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://my-flix-db-jd.herokuapp.com/users/${
        JSON.parse(localStorage.getItem("user")).Username
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setFavoriteMovies(data.FavoriteMovies);
        setIsFavorite(data.FavoriteMovies.includes(movie.id));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [movie]); // Add movie as a dependency so that movies marked as favorites don't appear as not favorited after refreshing the screen

  // Function to add or remove the movie as a favorite
  const toggleFavorite = () => {
    // Send a POST or DELETE request to the server
    const method = isFavorite ? "DELETE" : "POST";
    fetch(
      `https://my-flix-db-jd.herokuapp.com/users/${
        JSON.parse(localStorage.getItem("user")).Username
      }/movies/${encodeURIComponent(movie.id)}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          // Update the component's state to reflect the change in the user's favorites
          setIsFavorite(!isFavorite);
        } else {
          throw new Error(
            "An error occurred while trying to modify the user's favorites"
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={movie.image}
        style={{ cursor: "pointer" }}
        className="img-fluid h-100"
      />
      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <Card.Title className="text-center">{movie.title}</Card.Title>
        <Card.Text>{movie.director}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button className="btn mr-2">Details</Button>
        </Link>
      </Card.Body>
      {/* Add a button to add or remove the movie as a favorite */}
      <Button
        className="btn"
        onClick={toggleFavorite}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        {isFavorite ? (
          <i className="fas fa-star"></i>
        ) : (
          <i className="far fa-star"></i>
        )}
      </Button>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string,
  }).isRequired,
};
