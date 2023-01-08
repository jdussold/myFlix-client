import React from 'react'
import "./movie-view.scss"; // Import the styles for the component
import { useParams, useNavigate } from "react-router";
// Define the MovieView component
export const MovieView = ({ movies }) => {
  const { movieTitle } = useParams();
  const navigate = useNavigate()
  const [movie, setMovie] = React.useState(undefined)
  const [loading, setLoading] = React.useState(true)
  const token = localStorage.getItem("token");

  React.useEffect(()=> {
    // Check if there is a token or movieTitle in the url
    if(!movieTitle || !token) {
      setLoading(false);
      return
    }
    // Fetch movie data when authorized
    fetch(`https://my-flix-db-jd.herokuapp.com/movies/${movieTitle}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json()) // Convert the response to JSON
      .then((movie) => {
        // Update the movies state with the newly formatted data
        setMovie({
          id: movie._id,
          title: movie.Title,
          image: movie.ImagePath,
          description: movie.Description,
          genre: movie.Genre.Name,
          director: movie.Director.Name,
        });
        // Set loading to false once the data has been fetched
        setLoading(false);
      })
      .catch((error) => {
        // Display an alert if there is an error
        window.alert("An error occurred: " + error);
        // Set loading to false if there is an error
        setLoading(false);
      });
  },[movieTitle])

  if(loading) {
    return <div>loading...</div>
  }

  if(!movie){
    return <div>Couldn't find movie data</div>
  }
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
        onClick={()=> navigate("/")}
        className="back-button"
        style={{ cursor: "pointer" }}
      >
        Back
      </button>
    </div>
  );
};
