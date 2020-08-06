import React, { useEffect, useState, useCallback } from 'react';
import { firestore } from '../firebase';
import {
  Button,
  Card,
  CardContent,
  Statistic,
  Header,
  Image,
  Container,
  Breadcrumb,
  Divider,
  Accordion,
  AccordionTitle,
  AccordionContent,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { useParams } from 'react-router';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

interface MarketPage {
  date: string;
  name: string;
  market: string;
  price: number;
  url: string;
}

interface GameInfo {
  name: string;
  description: string;
  officialUrl: string;
  sumbnailUrl: string;
  pages: MarketPage[];
}

interface MarketHistory {
  date: number;
  price: number;
}

interface GameHistory {
  [url: string]: MarketHistory[];
}

const GameInfo: React.FC = () => {
  const id = useParams<{ id: string }>().id;

  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory>({});
  const [historyIsActives, setHistoryIsActives] = useState<boolean[]>([]);

  useEffect(() => {
    firestore
      .collection('games')
      .doc(id)
      .get()
      .then((doc) => {
        const info = doc.data() as GameInfo;
        setGameInfo(info);

        const actives = Array(info.pages.length);
        actives.fill(false);
        setHistoryIsActives(actives);
      });
    firestore
      .collection('history')
      .doc(id)
      .get()
      .then((doc) => {
        const history = doc.data() as GameHistory;
        setGameHistory(history);
      });
  }, [id]);

  const onHistoryToggle = useCallback(
    (index: number) => {
      historyIsActives[index] = !historyIsActives[index];
      console.log(historyIsActives[index]);
      setHistoryIsActives(historyIsActives);
    },
    [historyIsActives]
  );

  return (
    <PageWrapper>
      <Container textAlign="left">
        <Breadcrumb
          icon="right angle"
          sections={[
            {
              key: 'Home',
              content: 'Home',
              link: true,
            },
            { key: 'Store', content: 'Store', link: true },
            { key: 'Shirt', content: 'T-Shirt', active: true },
          ]}
        />
      </Container>
      <Divider />
      <Image floated="left" src={gameInfo?.sumbnailUrl} size="medium" />
      <Header size="large">
        {gameInfo?.name}
        <Header.Subheader>{gameInfo?.description}</Header.Subheader>
      </Header>
      {gameInfo?.pages.map((page, index) => {
        return (
          <Card fluid={true} key={index}>
            <CardContent>
              <Header size="huge" floated="left" content={page.market} />
              <Statistic
                floated="right"
                size="tiny"
                value={`¥${page.price.toLocaleString()}`}
                style={{
                  verticalAlign: 'bottom',
                }}
              />
            </CardContent>
            <CardContent>
              <Button color="teal" content="ストアに行く" floated="right" />
            </CardContent>
            <CardContent>
              <Accordion>
                <AccordionTitle
                  active={historyIsActives[index]}
                  onClick={() => {
                    historyIsActives[index] = !historyIsActives[index];
                    setHistoryIsActives(historyIsActives);
                  }}
                >
                  History
                </AccordionTitle>
                <AccordionContent active={historyIsActives[index]}>
                  <LineChart
                    width={400}
                    height={400}
                    data={gameHistory[page.url] || []}
                  >
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis />
                  </LineChart>
                  hogehuga
                </AccordionContent>
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </PageWrapper>
  );
};

export default GameInfo;
