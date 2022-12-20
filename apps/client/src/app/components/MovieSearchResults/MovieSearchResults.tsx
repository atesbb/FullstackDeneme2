import styles from './MovieSearchResults.module.scss';
import { Movie } from '@types';
import { connectHits } from 'react-instantsearch-dom';
import { Hit } from 'react-instantsearch-core';
import MovieBox from '../MovieBox/MovieBox';
import MovieEditForm from '../MovieEditForm/MovieEditForm';
import { useEffect, useState } from 'react';
import { updateMovie, deleteMovie } from '../../api/api.client';
import { showNotification } from '../../misc/showNotification';

const SearchResults = ({ hits }: { hits: Hit<Movie>[] }) => {
  const [editFormIsVisible, setEditFormIsVisible] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState({} as Movie);
  const [movies, setMovies] = useState([] as Movie[]);

  const handleDeleteMovie = (id: string) => {
    deleteMovie(id)
      .then((res) => {
        if (res.status < 400) {
          const index = movies.findIndex((item) => item._id === id);
          const moviesCopy = [...movies];
          moviesCopy.splice(index, 1);
          setMovies(moviesCopy);
        }
        return res;
      })
      .catch((err) => {
        showNotification('danger', err?.message);
      });
  };

  const handleUpdateMovie = (updatedMovie: Movie, id: string) => {
    return updateMovie(updatedMovie, id).then((res) => {
      if (res.status < 400) {
        const index = movies.findIndex((item) => item._id === id);
        const moviesCopy = [...movies];
        moviesCopy[index] = updatedMovie;
        setMovies(moviesCopy);
      }
      return res;
    });
  };

  useEffect(() => {
    setMovies(hits);
  }, [hits]);

  return (
    <div className={styles.movieSearchResultsContainer}>
      <MovieEditForm
        visible={editFormIsVisible}
        setVisible={setEditFormIsVisible}
        movie={selectedMovie}
        submitForm={handleUpdateMovie}
      />

      {movies.length ? (
        movies.map((movie) => (
          <MovieBox
            key={movie.objectID}
            movie={movie}
            setSelectedMovie={setSelectedMovie}
            setVisible={setEditFormIsVisible}
            handleDeleteMovie={handleDeleteMovie}
          />
        ))
      ) : (
        <h1>No results found</h1>
      )}
    </div>
  );
};

const MovieResultsHits = connectHits(SearchResults);

export default MovieResultsHits;
