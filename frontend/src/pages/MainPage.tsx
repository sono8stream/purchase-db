import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import {
  Button,
  Card,
  CardContent,
  Statistic,
  Image,
  CardHeader,
  CardDescription,
  CardGroup,
  ButtonGroup,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';

interface GamePage {
  date: string;
  name: string;
  market: string;
  price: number;
  url: string;
}

interface Game {
  id: string;
  name: string;
  description: string;
  officialUrl: string;
  sumbnailUrl: string;
  pages: GamePage[];
}

const Main: React.FC = () => {
  const [gameList, setGameList] = useState<Game[]>([]);

  useEffect(() => {
    firestore
      .collection('games')
      .get()
      .then((snapshot) => {
        const list: Game[] = [];
        snapshot.forEach((doc) => {
          const game = doc.data() as Game;
          game.id = doc.id;
          list.push(game);
        });
        setGameList(list);
      });
  }, []);

  return (
    <PageWrapper>
      <Button
        inverted
        content="ゲームを追加する"
        floated="right"
        color="red"
        as={Link}
        to="/games/create"
      />
      <CardGroup stackable itemsPerRow={3}>
        {gameList.map((game, index) => {
          let minMarket = '';
          let minPrice = 1e9;
          let minUrl = '';
          game.pages.forEach((page) => {
            if (page.price < minPrice) {
              minMarket = page.market;
              minPrice = page.price;
              minUrl = page.url;
            }
          });
          if (minPrice === 1e9) {
            minPrice = 0;
          }

          return (
            <Card fluid={true} key={index}>
              <Image
                floated="right"
                src={game.sumbnailUrl}
                size="tiny"
                wrapped
                ui={false}
              />
              <CardContent>
                <CardHeader size="medium" content={game.name} />
                <CardDescription>{game.description}</CardDescription>
                <Statistic
                  floated="right"
                  size="small"
                  label={minMarket}
                  value={`¥${minPrice.toLocaleString()}`}
                  style={{
                    verticalAlign: 'bottom',
                  }}
                />
              </CardContent>
              <CardContent extra>
                <ButtonGroup floated="right">
                  <Button
                    color="grey"
                    content="他の価格を見る"
                    as={Link}
                    to={`/games/${game.id}`}
                  />
                  <Button
                    color="teal"
                    content="ストアに行く"
                    as="a"
                    target="_blank"
                    href={minUrl}
                  />
                </ButtonGroup>
              </CardContent>
            </Card>
          );
        })}
      </CardGroup>
    </PageWrapper>
  );
};

export default Main;
