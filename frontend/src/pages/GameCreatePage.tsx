import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Header } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import GameBasicInfoForm from '../components/GameBasicInfoForm';

const GameCreatePage: React.FC = () => {
  const history = useHistory();

  return (
    <PageWrapper>
      <Header>新規ゲーム</Header>
      <GameBasicInfoForm onSubmit={() => history.push('/')} />
    </PageWrapper>
  );
};

export default GameCreatePage;
