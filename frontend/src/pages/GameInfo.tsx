import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import {
  Button,
  Card,
  CardContent,
  Grid,
  GridRow,
  GridColumn,
  Statistic,
  Header,
  Image,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { useParams, RouteComponentProps } from 'react-router';

interface MarketPage {
  date: string;
  name: string;
  market: string;
  price: string;
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
  price: string;
}

interface GameHistory {
  [url: string]: MarketHistory[];
}

const GameInfo: React.FC = () => {
  const id = useParams<{ id: string }>().id;

  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory | null>(null);

  useEffect(() => {
    firestore
      .collection('games')
      .doc(id)
      .get()
      .then((doc) => {
        const info = doc.data() as GameInfo;
        setGameInfo(info);
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

  return (
    <PageWrapper>
      <Image src={gameInfo?.sumbnailUrl} size="small" />
      <Header content={gameInfo?.name} size="large" />
      {gameInfo?.pages.map((page, index) => {
        return (
          <Card fluid={true} key={index}>
            <CardContent>
              <Header content={page.name} />
              <Header content={page.price} />
            </CardContent>
          </Card>
        );
      })}
    </PageWrapper>
  );
};

export default GameInfo;
