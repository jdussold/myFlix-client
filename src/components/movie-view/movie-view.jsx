import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./movie-view.scss";

export const MovieView = ({ movies }) => {
  // Get the movieId from the URL parameters
  const { movieId } = useParams();

  // Find the movie in the movies array that matches the movieId
  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="center-div">
      <div>
        {/* Display the movie's poster */}
        <img
          className="img-poster my-4 img-fluid w-50 d-block mx-auto"
          src={movie.image}
        />
      </div>
      <div>
        <span>
          {/* Display the movie's title */}
          <strong>Title:</strong>{" "}
        </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>
          {/* Display the movie's director */}
          <strong>Director:</strong>{" "}
        </span>
        <span>{movie.director}</span>
      </div>
      <div>
        <span>
          {/* Display the movie's description */}
          <strong>Description:</strong>{" "}
        </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>
          {/* Display the movie's genre */}
          <strong>Genre:</strong>{" "}
        </span>
        <span>{movie.genre}</span>
      </div>
      <div className="mt-4 text-center">
        {/* Link to the homepage */}
        <Link to={`/`}>
          <Button className="btn my-2">Home</Button>
        </Link>
      </div>
    </div>
  );
};
