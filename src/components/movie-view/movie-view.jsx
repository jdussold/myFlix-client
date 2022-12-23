import "./movie-view.scss";

export const MovieView = ({ movie, onBackClick }) => {
  const { image, title, description, genre, director } = movie;

  return (
    <div>
      <div>
        <img src={image} className="img-fluid w-50 d-block mx-auto" />
      </div>
      <div>
        <span>Title: </span>
        <span>{title}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{description}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{genre}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{director}</span>
      </div>
      <button
        onClick={onBackClick}
        className="back-button"
        style={{ cursor: "pointer" }}
      >
        Back
      </button>
    </div>
  );
};
