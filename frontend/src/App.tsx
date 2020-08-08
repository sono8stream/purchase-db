import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './components/ScrollToTop';
import MainPage from './pages/MainPage';
import GameInfoPage from './pages/GameInfoPage';
import GameCreatePage from './pages/GameCreatePage';

const App: React.FC = () => {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <ScrollToTop>
        <Switch>
          <Route exact={true} path="/games/create" component={GameCreatePage} />
          <Route exact={true} path="/games/:id" component={GameInfoPage} />
          <Route path="/" component={MainPage} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
};

export default App;
