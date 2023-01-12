import React, { useEffect, useState } from "react";
//Import the PropTypes library
import PropTypes from "prop-types";
// Import the Button and Card components from the react-bootstrap library
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./movie-card.scss";

//The MovieCard Function Component
// The component returns a Card element with an image, title, director, and a button
export const MovieCard = ({ movie, isFavorite, toggleFavorite }) => {
  return (
    <Card className="h-100 movie-card" style={{ backgroundColor: "#1F2941" }}>
      <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
        <Card.Img
          variant="top"
          src={movie.image}
          style={{ cursor: "pointer" }}
          className="img-cover"
        />
      </Link>

      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <Card.Title className="text-center title-text">
          {movie.title}
        </Card.Title>
        <Card.Text className="card-text">{movie.director}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button className="btn mr-2">Details</Button>
        </Link>
      </Card.Body>
      {/* Add a button to add or remove the movie as a favorite */}
      <Button
        className="custom-btn"
        onClick={() => toggleFavorite(isFavorite)}
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
