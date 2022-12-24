//Here you import the PropTypes library
import PropTypes from "prop-types";

import { Button, Card } from "react-bootstrap";

//The MovieCard Function Component
export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card className="h-100" onClick={() => onMovieClick(movie)}>
      <Card.Img
        variant="top"
        src={movie.image}
        style={{ cursor: "pointer" }}
        className="img-fluid h-100"
      />
      <Card.Body className="text-center">
        <Card.Title className="text-center">{movie.title}</Card.Title>
        <Card.Text>{movie.director}</Card.Text>
        <Button onClick={() => onMovieClick(movie)} className="btn">
          Details
        </Button>
      </Card.Body>
    </Card>
  );
};
