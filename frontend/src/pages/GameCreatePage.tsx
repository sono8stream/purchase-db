import React, { useCallback, useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Form, Header, FormButton, FormInput } from 'semantic-ui-react';
import { firestore } from '../firebase';
import { useHistory } from 'react-router';

const GameCreatePage: React.FC = () => {
  const history = useHistory();
  const [officialUrl, setOfficialUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sumbnailUrl, setSumbnailUrl] = useState('');

  const fillByOfficialURL = useCallback(() => {
    if (
      officialUrl.startsWith('http://') ||
      officialUrl.startsWith('https://')
    ) {
      fetch(
        `https://asia-northeast2-game-subscribe-db.cloudfunctions.net/getMetaInfo?url=${officialUrl}`
      ).then((res) => {
        res.json().then((json) => {
          if (!title) {
            setTitle(json.title);
          }
          if (!description) {
            setDescription(json.description);
          }
          if (!sumbnailUrl) {
            setSumbnailUrl(json.sumbnailUrl);
          }
        });
      });
    }
  }, [officialUrl]);

  const submitNewGame = useCallback(() => {
    if (officialUrl && title && description && sumbnailUrl) {
      firestore
        .collection('games')
        .add({ name: title, description, officialUrl, sumbnailUrl, pages: [] });
      history.push('/');
    }
  }, [officialUrl, title, description, sumbnailUrl]);

  return (
    <PageWrapper>
      <Header>新規ゲーム</Header>
      <Form>
        <Form>
          <FormInput
            label="・公式サイトURL"
            required
            value={officialUrl}
            onChange={(e, { name, value }) => setOfficialUrl(value)}
          />
          <FormButton
            basic
            color="green"
            content="公式サイトから情報を取得"
            onClick={fillByOfficialURL}
          />
        </Form>
        <div style={{ height: 16 }} />
        <FormInput
          label="・ゲーム名"
          required
          value={title}
          onChange={(e, { name, value }) => setTitle(value)}
        />
        <FormInput
          label="・説明"
          required
          value={description}
          onChange={(e, { name, value }) => setDescription(value)}
        />
        <FormInput
          label="・サムネイルURL"
          required
          value={sumbnailUrl}
          onChange={(e, { name, value }) => setSumbnailUrl(value)}
        />
        <FormButton
          basic
          color="blue"
          content="ゲームを追加"
          onClick={submitNewGame}
        />
      </Form>
    </PageWrapper>
  );
};

export default GameCreatePage;
