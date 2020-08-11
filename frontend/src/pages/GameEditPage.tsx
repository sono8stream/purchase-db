import React, { useCallback, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import {
  Form,
  Header,
  FormButton,
  FormInput,
  Loader,
  Segment,
  Button,
} from 'semantic-ui-react';
import { firestore } from '../firebase';
import { useHistory, useParams } from 'react-router';
import GameBasicInfoForm from '../components/GameBasicInfoForm';
import GameMarketInfoForm from '../components/GameMarketInfoForm';
import { Link } from 'react-router-dom';

const GameEditPage: React.FC = () => {
  const history = useHistory();
  const id = useParams<{ id: string }>().id;

  return (
    <PageWrapper>
      <Button
        color="green"
        content="← 戻る"
        inverted
        as={Link}
        to={`/games/${id}`}
      />
      <Segment>
        <Header>基本情報</Header>
        <GameBasicInfoForm id={id} onSubmit={() => {}} />
      </Segment>
      <Segment>
        <Header>ストア情報</Header>
        <GameMarketInfoForm id={id} />
      </Segment>
      <Button
        color="green"
        content="← 戻る"
        inverted
        as={Link}
        to={`/games/${id}`}
      />
    </PageWrapper>
  );
};

export default GameEditPage;
