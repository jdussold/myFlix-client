import React from "react";
//Import the PropTypes library
import PropTypes from "prop-types";
// Import the Button and Card components from the react-bootstrap library
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
//The MovieCard Function Component
// The component returns a Card element with an image, title, director, and a button
export const MovieCard = ({ movie }) => {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={movie.image}
        style={{ cursor: "pointer" }}
        className="img-fluid h-100"
      />
      <Card.Body className="text-center">
        <Card.Title className="text-center">{movie.title}</Card.Title>
        <Card.Text>{movie.director}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button className="btn">Details</Button>
        </Link>
      </Card.Body>
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
