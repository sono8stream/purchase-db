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
  CardHeader,
  CardDescription,
  CardGroup,
  Segment,
  Container,
  ButtonGroup,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';

interface GamePage {
  date: string;
  name: string;
  market: string;
  price: string;
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
      <CardGroup stackable itemsPerRow={3}>
        {gameList.map((game, index) => {
          let minMarket = 'here';
          let minPrice = 1e9;
          let minUrl = '';
          game.pages.forEach((page) => {
            const price = Number(page.price.replace(/[^0-9]/g, ''));
            if (price < minPrice) {
              minMarket = page.market;
              minPrice = price;
              minUrl = page.url;
            }
          });

          return (
            <Card fluid={true} key={index}>
              <Image
                floated="left"
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
                  value={`¥${minPrice}`}
                />
              </CardContent>
              <CardContent extra>
                <ButtonGroup floated="right">
                  <Button
                    color="teal"
                    content="ストアに行く"
                    as="a"
                    target="_blank"
                    href={minUrl}
                  />
                  <Button
                    color="black"
                    content="その他の価格"
                    as={Link}
                    to={`/games/${game.id}`}
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
