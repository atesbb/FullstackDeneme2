import { Movie, moviesMockData } from '@types';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import MovieBox from './MovieBox';
import { Hit } from 'react-instantsearch-core';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container as HTMLDivElement);
  container.remove();
});

it('renders movie data', async () => {
  const movie: Hit<Movie> = {
    _id: '123',
    _highlightResult: {},
    ...moviesMockData[0],
  };

  await act(async () => {
    render(
      <MovieBox
        movie={movie}
        setSelectedMovie={jest.fn()}
        setVisible={jest.fn()}
        handleDeleteMovie={jest.fn()}
      />,
      container
    );
  });

  expect(container.querySelector('h5')?.textContent).toBe(movie.title);

  expect(
    container
      .querySelector('span')
      ?.textContent?.includes(movie.year.toString())
  ).toBeTruthy();

  expect(
    container
      .querySelectorAll('span')[1]
      .textContent?.includes(movie.score.toFixed(2))
  ).toBeTruthy();

  container
    .querySelectorAll('.badge')
    .forEach((badge, idx) => expect(badge.textContent).toBe(movie.genre[idx]));
});
