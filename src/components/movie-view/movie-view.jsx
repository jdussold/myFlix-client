import "./movie-view.scss"; // Import the styles for the component

// Define the MovieView component
export const MovieView = ({ movie, onBackClick }) => {
  // Destructure the movie object to get the image, title, description, genre, and director
  const { image, title, description, genre, director } = movie;

  // Return the JSX that will be rendered for this component
  return (
    <div>
      {/* Render the movie image */}
      <div>
        <img src={image} className="img-fluid w-50 d-block mx-auto" />
      </div>
      {/* Render the title */}
      <div>
        <span>Title: </span>
        <span>{title}</span>
      </div>
      {/* Render the description */}
      <div>
        <span>Description: </span>
        <span>{description}</span>
      </div>
      {/* Render the genre */}
      <div>
        <span>Genre: </span>
        <span>{genre}</span>
      </div>
      {/* Render the director */}
      <div>
        <span>Director: </span>
        <span>{director}</span>
      </div>
      {/* Render the back button with a click event handler */}
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
