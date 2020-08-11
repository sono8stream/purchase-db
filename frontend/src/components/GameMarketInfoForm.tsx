import React, { useCallback, useState } from 'react';
import { Form, FormButton, FormInput, Loader, Table } from 'semantic-ui-react';
import { firestore, functions } from '../firebase';
import MarketPage from '../models/MarketPage';

interface PageInfo {
  name: string;
  market: string;
  price: number;
}

const GameMarketInfoForm: React.FC<{ id: string }> = ({ id }) => {
  const [storeUrl, setStoreUrl] = useState('');
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [storeUrlIsValid, setStoreUrlIsValid] = useState(false);
  const [storeInfo, setStoreInfo] = useState('');
  const [pages, setPages] = useState([] as MarketPage[]);

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
            if (info.name) {
              setStoreInfo(`${info.market}/${info.name}`);
              setStoreUrlIsValid(true);
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
    firestore.collection('games').doc(id).update({ pages });
  }, []);

  return (
    <>
      <Form>
        <Form>
          <FormInput
            label="・ストアURL"
            required
            value={storeUrl}
            onChange={(e, { name, value }) => setStoreUrl(value)}
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
          label="・ストア/商品情報"
          required
          value={storeInfo}
          onChange={(e, { name, value }) => setStoreInfo(value)}
        />
        <FormButton
          basic
          color="blue"
          content="ゲームを追加"
          onClick={submitNewStore}
        />
      </Form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ストア/商品情報</Table.HeaderCell>
            <Table.HeaderCell>URL</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>First</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};

export default GameMarketInfoForm;
