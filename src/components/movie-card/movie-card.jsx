//Import the PropTypes library
import PropTypes from "prop-types";

// Import the Button and Card components from the react-bootstrap library
import { Button, Card } from "react-bootstrap";

//The MovieCard Function Component
// The component returns a Card element with an image, title, director, and a button
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
