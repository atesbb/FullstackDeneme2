import { FaStar } from 'react-icons/fa';

interface RatingProps {
  stars: number;
}

const Rating = (props: RatingProps) => {
  const stars = Array(props.stars)
    .fill(null)
    .map((_, idx) => <FaStar key={idx} fill='gold' />);
  const emptyStars = Array(5 - props.stars)
    .fill(null)
    .map((_, idx) => <FaStar key={idx + stars.length} fill='grey' />);
  return <div>{[...stars, ...emptyStars]}</div>;
};

export default Rating;
