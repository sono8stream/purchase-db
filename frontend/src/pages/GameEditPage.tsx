import React, { useCallback, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import {
  Form,
  Header,
  FormButton,
  FormInput,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { firestore } from '../firebase';
import { useHistory, useParams } from 'react-router';
import GameBasicInfoForm from '../components/GameBasicInfoForm';
import GameMarketInfoForm from '../components/GameMarketInfoForm';

const GameEditPage: React.FC = () => {
  const history = useHistory();
  const id = useParams<{ id: string }>().id;

  return (
    <PageWrapper>
      <Segment>
        <Header>基本情報</Header>
        <GameBasicInfoForm onSubmit={() => {}} />
      </Segment>
      <Segment>
        <Header>ストア情報</Header>
        <GameMarketInfoForm id={id} />
      </Segment>
    </PageWrapper>
  );
};

export default GameEditPage;
