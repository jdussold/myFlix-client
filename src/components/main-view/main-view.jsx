import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      description:
        "In the first part, The Lord of the Rings, a shy young hobbit named Frodo Baggins inherits a simple gold ring that holds the secret to the survival--or enslavement--of the entire world.",
      image: "https://m.media-amazon.com/images/I/A1yy50fuVnL._AC_UY218_.jpg",
      genre: "Adventure",
      director: "Peter Jackson",
    },
    {
      id: 2,
      title: "John Wick",
      description:
        "When sadistic thugs attack John Wick (Keanu Reeves) - a brilliantly lethal ex-assassin - he hunts them down with the skill and ruthlessness that made him an underworld legend.",
      image: "https://m.media-amazon.com/images/I/71yiiUdmM6L._AC_UY218_.jpg",
      genre: "Action",
      director: "Chad Stahelski",
    },
    {
      id: 3,
      title: "Monty Python And The Holy Grail",
      description:
        "This 'cult classic' comedy from the Monty Python team loosely follows the legend of King Arthur (Graham Chapman), along with his squire (Terry Gilliam) and his Knights of the Round Table (John Cleese, Eric Idle, Terry Jones and Michael Palin), as they embark on a fearless quest in search of the elusive Holy Grail. A hysterical, historical tour-de-force from Terry Gilliam and Terry Jones.",
      image: "https://m.media-amazon.com/images/I/71nh++tM5xL._AC_UY218_.jpg",
      genre: "Action",
      director: "Chad Stahelski",
    },
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  if (movies.length === 0) {
    return <div>The list is empty!</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};
