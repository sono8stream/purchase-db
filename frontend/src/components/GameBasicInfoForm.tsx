import React, { useCallback, useState, useEffect } from 'react';
import { Form, FormButton, FormInput, Loader, Icon } from 'semantic-ui-react';
import { firestore } from '../firebase';
import GameInfo from '../models/GameInfo';

const GameBasicInfoForm: React.FC<{
  id: string;
  onSubmit: (id: string) => void;
}> = ({ id, onSubmit }) => {
  const [officialUrl, setOfficialUrl] = useState('');
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sumbnailUrl, setSumbnailUrl] = useState('');
  const [fetchErrorMessage, setFetchErrorMessage] = useState<string | null>(
    null
  );
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [submitSucceeded, setSubmitSucceeded] = useState(id ? true : false);

  useEffect(() => {
    if (id) {
      firestore
        .collection('games')
        .doc(id)
        .get()
        .then((doc) => {
          const info = doc.data() as GameInfo;
          setOfficialUrl(info.officialUrl);
          setTitle(info.name);
          setDescription(info.description);
          setSumbnailUrl(info.sumbnailUrl);
        });
    }
  }, [id]);

  const fillByOfficialURL = useCallback(() => {
    if (
      officialUrl.startsWith('http://') ||
      officialUrl.startsWith('https://')
    ) {
      setIsFetchingInfo(true);
      setFetchErrorMessage(null);

      fetch(
        `https://asia-northeast2-game-subscribe-db.cloudfunctions.net/getMetaInfo?url=${officialUrl}`
      )
        .then((res) => res.json())
        .then((json) => {
          setTitle(json.title);
          setDescription(json.description);
          setSumbnailUrl(json.sumbnailUrl);
          setIsFetchingInfo(false);
        })
        .catch((e) => {
          console.log('a');
          setFetchErrorMessage('情報を取得できませんでした');
          setIsFetchingInfo(false);
        });
    } else {
      setFetchErrorMessage('URLを入力してください');
    }
  }, [officialUrl]);

  const submitNewGame = useCallback(() => {
    setIsSubmittingInfo(true);
    if (id) {
      firestore
        .collection('games')
        .doc(id)
        .update({
          name: title,
          description,
          officialUrl,
          sumbnailUrl,
        })
        .then(() => {
          onSubmit(id);
          setIsSubmittingInfo(false);
          setSubmitSucceeded(true);
        })
        .catch(() => {
          setIsSubmittingInfo(false);
        });
    } else {
      firestore
        .collection('games')
        .add({
          name: title,
          description,
          officialUrl,
          sumbnailUrl,
          pages: [],
        })
        .then((ref) => {
          onSubmit(ref.id);
          setIsSubmittingInfo(false);
          setSubmitSucceeded(true);
        })
        .catch(() => {
          setIsSubmittingInfo(false);
        });
    }
  }, [officialUrl, title, description, sumbnailUrl, onSubmit]);

  return (
    <Form>
      <Form>
        <FormInput
          label="・公式サイトURL"
          required
          value={officialUrl}
          onChange={(e, { name, value }) => {
            setOfficialUrl(value);
            setSubmitSucceeded(false);
          }}
          error={fetchErrorMessage}
        />
        <FormButton
          basic
          color="green"
          content="公式サイトから情報を取得"
          onClick={fillByOfficialURL}
        />
        <Loader active={isFetchingInfo} inline />
      </Form>
      <div style={{ height: 16 }} />
      <FormInput
        label="・ゲーム名"
        required
        value={title}
        onChange={(e, { name, value }) => {
          setTitle(value);
          setSubmitSucceeded(false);
        }}
      />
      <FormInput
        label="・説明"
        value={description}
        onChange={(e, { name, value }) => {
          setDescription(value);
          setSubmitSucceeded(false);
        }}
      />
      <FormInput
        label="・サムネイルURL"
        value={sumbnailUrl}
        onChange={(e, { name, value }) => {
          setSumbnailUrl(value);
          setSubmitSucceeded(false);
        }}
      />
      <FormButton
        basic
        color="blue"
        content={id ? '更新' : 'ゲームを追加'}
        disabled={!(officialUrl && title)}
        onClick={submitNewGame}
      />
      <Loader active={isSubmittingInfo} inline />
      {(() => (submitSucceeded ? <Icon name="check" color="green" /> : null))()}
    </Form>
  );
};

export default GameBasicInfoForm;
