import { Movie } from '@types';
import { FormErrors } from '../../hooks/useForm.hook';

// basic frontend validation. Rest is done on the backend
export default function validateMovieCreation(
  values: Movie
): FormErrors<Movie> {
  const errors = {} as FormErrors<Movie>;
  // TODO: improve validation and descriptions
  if (!values.title?.trim()) {
    errors.title = 'Title  is required';
  }
  if (values.title && /[^a-zA-Z0-9 \- :]/.test(values.title)) {
    errors.title = 'Invalid title.';
  }
  if (!values.year) {
    errors.year = 'Year is required';
  }
  if (values.year && values.year > new Date().getFullYear()) {
    errors.year = 'Year cannot be in the future';
  }
  if (!values.image?.includes('http')) {
    errors.image = 'Image must be a url';
  }
  if (Number.isNaN(values.score)) {
    errors.score = 'Score must be a number';
  }
  if (!values.rating) {
    errors.rating = 'Rating is required';
  }
  if (!values.alternative_titles) {
    errors.alternative_titles = 'Alternative titles are required';
  }
  if (!values.genre) {
    errors.genre = 'Genres are required';
  }
  if (!values.color?.includes('#')) {
    errors.color = 'Color must be a hexadecimal value';
  }
  if (!values.alternative_titles?.length) {
    errors.alternative_titles = 'Must provide at least one alternative title';
  }
  if (!values.genre?.length) {
    errors.genre = 'Must provide at least one genre';
  }
  return errors;
}
