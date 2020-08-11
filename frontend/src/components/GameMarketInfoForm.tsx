import React, { useCallback, useState, useEffect } from 'react';
import { Form, FormButton, FormInput, Loader, Table } from 'semantic-ui-react';
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

  useEffect(() => {
    firestore
      .collection('games')
      .doc(id)
      .get()
      .then((doc) => {
        const info = doc.data() as GameInfo;
        setPages(info.pages);
      });
  }, []);

  const changeStoreUrl = useCallback((val) => {
    setStoreUrl(val);
    setStoreUrlIsValid(false);
  }, []);

  const fillByOfficialURL = useCallback(() => {
    if (storeUrl.startsWith('http://') || storeUrl.startsWith('https://')) {
      setIsFetchingInfo(true);

      fetch('/getPrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: [storeUrl] }),
      })
        .then((res) => {
          res.json().then((json) => {
            const info = json.pages[0] as PageInfo;
            if (info && info.name) {
              setPageInfo({
                name: info.name,
                market: info.market,
                price: info.price,
              });
              setStoreUrlIsValid(true);
              const dateTmp = new Date();
              const unixDateTmp = Math.floor(dateTmp.getTime() / 1000);
              setUnixDate(unixDateTmp);
            }
            setIsFetchingInfo(false);
          });
        })
        .catch((e) => {
          setIsFetchingInfo(false);
        });
    }
  }, [storeUrl]);

  const submitNewStore = useCallback(() => {
    const newPages = pages;
    newPages.push({
      name: pageInfo.name,
      market: pageInfo.market,
      price: pageInfo.price,
      url: storeUrl,
    });
    setPages(newPages);
    firestore
      .collection('games')
      .doc(id)
      .update({ pages: newPages })
      .then(() => {
        console.log('hoge');
        firestore
          .collection('history')
          .doc(id)
          .get()
          .then((snapshot) => {
            const data = snapshot.data() || {};

            pages.forEach((page) => {
              if (!(page.url in data)) {
                data[page.url] = [];
              }
              data[page.url].unshift({ date: unixDate, price: page.price });
            });

            firestore.collection('history').doc(id).set(data);
            setStoreUrl('');
            setPageInfo({ name: '', market: '', price: 0 });
            setStoreUrlIsValid(false);
          });
      });
  }, [pageInfo, unixDate, storeUrl]);

  return (
    <>
      <Form>
        <Form>
          <FormInput
            label="・ストアURL"
            required
            value={storeUrl}
            onChange={(e, { name, value }) => changeStoreUrl(value)}
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
          label="・ストア"
          required
          value={pageInfo.market}
          onChange={(e, { name, value }) =>
            setPageInfo({ ...pageInfo, market: value })
          }
        />
        <FormInput
          label="・プラットフォーム / 購入形式"
          required
          value={pageInfo.name}
          onChange={(e, { name, value }) =>
            setPageInfo({ ...pageInfo, name: value })
          }
        />
        <FormButton
          basic
          color="blue"
          content="ゲームを追加"
          disabled={!storeUrlIsValid}
          onClick={submitNewStore}
        />
      </Form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ストア</Table.HeaderCell>
            <Table.HeaderCell>プラットフォーム / 購入形式</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {pages.map((page, index) => (
            <Table.Row key={index}>
              <Table.Cell>{page.market}</Table.Cell>
              <Table.Cell>{page.name}</Table.Cell>
              <Table.Cell>
                <a href={page.url} target="_blank">
                  {page.url}
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default GameMarketInfoForm;
