import React, { useCallback, useState, useEffect } from 'react';
import {
  Form,
  FormButton,
  FormInput,
  Loader,
  Table,
  Button,
  Input,
  Message,
  Icon,
} from 'semantic-ui-react';
import { firestore } from '../firebase';
import MarketPage from '../models/MarketPage';
import GameInfo from '../models/GameInfo';

interface PageInfo {
  name: string;
  market: string;
  price: number;
}

const GameMarketInfoForm: React.FC<{ id: string }> = ({ id }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [storeUrlIsValid, setStoreUrlIsValid] = useState(false);
  const [pageInfo, setPageInfo] = useState({ name: '', market: '', price: 0 });
  const [unixDate, setUnixDate] = useState(0);
  const [pages, setPages] = useState([] as MarketPage[]);
  const [isSettingNewStore, setIsSettingNewStore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    firestore
      .collection('games')
      .doc(id)
      .get()
      .then((doc) => {
        const info = doc.data() as GameInfo;
        setPages(info.pages);
      });
  }, [id]);

  const changeStoreUrl = useCallback((val) => {
    setStoreUrl(val);
    setStoreUrlIsValid(false);
  }, []);

  const fillByOfficialURL = useCallback(() => {
    if (storeUrl.startsWith('http://') || storeUrl.startsWith('https://')) {
      setIsFetchingInfo(true);
      setErrorMessage(null);

      fetch(
        'https://asia-northeast2-game-subscribe-db.cloudfunctions.net/getPrices',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ urls: [storeUrl] }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          const info = json.pages[0] as PageInfo;

          if (!info.price) {
            throw new Error('Price value is invalid');
          }

          setPageInfo({
            name: pageInfo.name ? pageInfo.name : info.name,
            market: info.market,
            price: info.price,
          });
          setStoreUrlIsValid(true);
          const dateTmp = new Date();
          const unixDateTmp = Math.floor(dateTmp.getTime() / 1000);
          setUnixDate(unixDateTmp);
          setIsFetchingInfo(false);
          setErrorMessage(null);
        })
        .catch(() => {
          setErrorMessage('情報を取得できませんでした');
          setIsFetchingInfo(false);
        });
    } else {
      setErrorMessage('URLを入力してください');
    }
  }, [storeUrl, pageInfo.name]);

  const submitNewStore = useCallback(() => {
    setIsSettingNewStore(true);
    const newPages = [
      ...pages,
      {
        name: pageInfo.name,
        market: pageInfo.market,
        price: pageInfo.price,
        url: storeUrl,
      },
    ];
    firestore
      .collection('games')
      .doc(id)
      .update({ pages: newPages })
      .then(() => {
        firestore
          .collection('history')
          .doc(id)
          .get()
          .then((snapshot) => {
            const data = snapshot.data() || {};

            if (!(storeUrl in data)) {
              data[storeUrl] = [];
            }
            data[storeUrl].unshift({ date: unixDate, price: pageInfo.price });

            firestore.collection('history').doc(id).set(data);
            setStoreUrl('');
            setPageInfo({ name: '', market: '', price: 0 });
            setPages(newPages);
            setStoreUrlIsValid(false);
            setIsSettingNewStore(false);
          });
      });
  }, [pageInfo, unixDate, storeUrl, id, pages]);

  const updatePagesStoreName = useCallback(
    (i: number, newName: string) => {
      const newPages = pages.map((page, index) =>
        index === i ? { ...page, name: newName } : page
      );
      setPages(newPages);
      firestore.collection('games').doc(id).update({ pages: newPages });
    },
    [pages, id]
  );

  const removePagesStoreInfo = useCallback(
    (i: number) => {
      const newPages = pages.filter((page, index) => index !== i);
      firestore.collection('games').doc(id).update({ pages: newPages });
      setPages(newPages);
    },
    [pages, id]
  );

  return (
    <>
      <Form>
        <Message content="ストアURLを入力したあとにURLを検証してください。検証が成功するとゲームを追加できます。" />
        <Form>
          <FormInput
            label="・ストアURL"
            required
            value={storeUrl}
            onChange={(e, { name, value }) => changeStoreUrl(value)}
            error={errorMessage}
          />
          <FormButton
            basic
            color="green"
            content="URLを検証"
            onClick={fillByOfficialURL}
          />
          <Loader active={isFetchingInfo} inline />
        </Form>
        <div style={{ height: 16 }} />
        <FormInput
          label="・プラットフォーム / バージョン"
          value={pageInfo.name}
          onChange={(e, { name, value }) =>
            setPageInfo({ ...pageInfo, name: value })
          }
        />
        <FormButton
          basic
          color="blue"
          content="ストアを追加"
          disabled={!storeUrlIsValid}
          onClick={submitNewStore}
        />
        <Loader active={isSettingNewStore} inline />
        {(() =>
          storeUrlIsValid ? <Icon name="check" color="green" /> : null)()}
      </Form>
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ストア</Table.HeaderCell>
            <Table.HeaderCell>プラットフォーム / バージョン</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {pages.map((page, index) => (
            <Table.Row key={index}>
              <Table.Cell>{page.market}</Table.Cell>
              <Table.Cell>
                <Input
                  defaultValue={page.name}
                  onBlur={(e: any) =>
                    updatePagesStoreName(index, e.target.value)
                  }
                  type="text"
                />
              </Table.Cell>
              <Table.Cell>
                <a href={page.url} target="_blank" rel="noopener noreferrer">
                  {page.url}
                </a>
              </Table.Cell>
              <Table.Cell>
                <Button
                  content="削除"
                  color="red"
                  inverted
                  onClick={() => removePagesStoreInfo(index)}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default GameMarketInfoForm;
