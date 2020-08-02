import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './components/ScrollToTop';
import Main from './pages/Main';
import GameInfo from './pages/GameInfo';

const App: React.FC = () => {
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <ScrollToTop>
        <Switch>
          <Route exact={true} path="/games/:id" component={GameInfo} />
          <Route path="/" component={Main} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
};

export default App;
