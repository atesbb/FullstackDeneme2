import styles from './app.module.scss';
import { ReactNotifications } from 'react-notifications-component';
import MainPage from './pages/MainPage';
import 'react-notifications-component/dist/theme.css';

export function App() {
  return (
    <div className={styles.app}>
      <ReactNotifications />
      <MainPage />
    </div>
  );
}

export default App;
