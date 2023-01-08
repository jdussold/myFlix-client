//Import the PropTypes library
import PropTypes from "prop-types";

// Import the Button and Card components from the react-bootstrap library
import { Badge, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router";

//The MovieCard Function Component
// The component returns a Card element with an image, title, director, and a button
export const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user")); // You shouldnt store the user information or fetch from localStorage. You should always ask the server
  const token = localStorage.getItem("token");

  function addToFavorite(){
    fetch(`https://my-flix-db-jd.herokuapp.com/users/${user.Username}/movies/${movie.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      method: "POST"
    })
    .then((response) => response.json())
    .then(result => {
      // You should refetch loggedin user data at this point
        console.log(result)
    }).catch(err => {
      console.log(err)
    })
  }
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
        <Button onClick={() => navigate(`/movies/${movie.title}`)} className="btn mx-2">
          Details
        </Button>
        <Button onClick={addToFavorite} className="btn">
          Add to Favorite
        </Button>
      </Card.Body>
    </Card>
  );
};
