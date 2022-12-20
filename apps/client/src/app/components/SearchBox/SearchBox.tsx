import { connectSearchBox } from 'react-instantsearch-dom';
import styles from './SearchBox.module.scss';
import genericStyles from '../../generic-styles.module.scss';
import { FaSearch } from 'react-icons/fa';

const SearchBox = connectSearchBox(({ currentRefinement, refine }) => (
  <div className={styles.searchBoxContainer}>
    <FaSearch className={styles.searchIcon} />
    <input
      type='text'
      value={currentRefinement}
      onChange={(e) => refine(e.target.value)}
      className={genericStyles.inputBar}
      placeholder='Search for movies'
    />
  </div>
));

export default SearchBox;
