import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./movie-view.scss";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();

  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="center-div">
      <div>
        <img
          className="img-poster my-4 img-fluid w-50 d-block mx-auto"
          src={movie.image}
        />
      </div>
      <div>
        <span>
          <strong>Title:</strong>{" "}
        </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>
          <strong>Director:</strong>{" "}
        </span>
        <span>{movie.director}</span>
      </div>
      <div>
        <span>
          <strong>Description:</strong>{" "}
        </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>
          <strong>Genre:</strong>{" "}
        </span>
        <span>{movie.genre}</span>
      </div>
      <div className="mt-4 text-center">
        <Link to={`/`}>
          <Button className="btn my-2">Back</Button>
        </Link>
      </div>
    </div>
  );
};
