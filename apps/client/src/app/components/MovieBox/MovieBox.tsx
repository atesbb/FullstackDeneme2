import styles from './MovieBox.module.scss';
import { Hit } from 'react-instantsearch-core';
import Badge from '../Badge/Badge';
import { Movie } from '@types';
import Rating from '../Rating/Rating';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDeleteOutline } from 'react-icons/md';

interface MovieBoxProps {
  movie: Movie;
  handleDeleteMovie: (id: string) => void;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GenresProps {
  genres: string[];
}

// TODO: get this image from a local file
const fallbackImage =
  'http://www.proedsolutions.com/wp-content/themes/micron/images/placeholders/placeholder_small_dark.jpg';

const imageOnErrorHandler = (
  event: React.SyntheticEvent<HTMLImageElement, Event>
) => {
  event.currentTarget.src = fallbackImage;
};

const GenresContainer = ({ genres }: GenresProps) => (
  <div className={styles.genresContainer}>
    {genres.map((genre, idx) => (
      <Badge text={genre} key={idx} />
    ))}
  </div>
);

const MovieBox = ({
  movie,
  setSelectedMovie,
  setVisible,
  handleDeleteMovie,
}: MovieBoxProps) => {
  const handleEditClick = () => {
    setVisible(true);
    setSelectedMovie({
      _id: movie._id,
      title: movie.title,
      year: movie.year,
      score: movie.score,
      rating: movie.rating,
      color: movie.color,
      alternative_titles: movie.alternative_titles,
      image: movie.image,
      actors: movie.actors,
      genre: movie.genre,
      actor_facets: movie.actor_facets,
    } as Movie);
  };

  return (
    <div className={styles.movieBox}>
      <FaEdit
        onClick={handleEditClick}
        className={`${styles.editMovieIcon} ${styles.movieIcon}`}
      />
      {/* // TODO: add confirmation dialog when deleting */}
      <MdOutlineDeleteOutline
        className={`${styles.deleteMovieIcon} ${styles.movieIcon}`}
        onClick={() => handleDeleteMovie(movie._id)}
      />
      <img
        className={styles.movieImage}
        src={movie.image}
        alt={movie.title}
        onError={imageOnErrorHandler}
      />
      <h5>{movie.title}</h5>
      <span id='movie-year' className={styles.description}>
        Year: {movie.year}
      </span>
      <span id='movie-score' className={styles.description}>
        Score: {Number(movie.score)?.toFixed(2)}
      </span>
      <Rating stars={movie.rating} />
      <GenresContainer genres={movie.genre} />
    </div>
  );
};

export default MovieBox;
