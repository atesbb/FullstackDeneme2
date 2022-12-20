import { InstantSearch, Configure } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import MovieResultsHits from '../components/MovieSearchResults/MovieSearchResults';
import SearchBox from '../components/SearchBox/SearchBox';
import { config } from '../config/config';
import { useState } from 'react';
import { createMovie } from '../api/api.client';
import MovieEditForm from '../components/MovieEditForm/MovieEditForm';
import { Movie } from '@types';
import genericStyles from '../generic-styles.module.scss';

const searchClient = algoliasearch(config.algolia.appId, config.algolia.apiKey);

const MainPage = (props: any) => {
  const [createFormIsVisible, setCreateFormIsVisible] = useState(false);
  const emptyMovie: Movie = {
    _id: '',
    objectID: '',
    title: '',
    year: 0,
    score: 0,
    rating: 0,
    color: '#fff',
    alternative_titles: [],
    image: '',
    actors: [],
    genre: [],
    actor_facets: [],
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={config.algolia.moviesIndex}
      searchState={props.searchState}
      createURL={props.createURL}
      onSearchStateChange={props.onSearchStateChange}
    >
      <Configure hitsPerPage={30} />
      <MovieEditForm
        visible={createFormIsVisible}
        movie={emptyMovie}
        setVisible={setCreateFormIsVisible}
        submitForm={createMovie}
      />
      <section>
        <SearchBox />
        <button
          className={genericStyles.button}
          onClick={() => setCreateFormIsVisible(true)}
        >
          Add movie
        </button>
        <MovieResultsHits />
      </section>
    </InstantSearch>
  );
};

export default MainPage;
