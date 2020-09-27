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
  Divider,
  Breadcrumb,
  BreadcrumbSection,
  Container,
  GridRow,
  Grid,
  GridColumn,
  Header,
  Placeholder,
  PlaceholderImage,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';
import getStoreName from '../utils/getStoreName';

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
      <Container textAlign="left">
        <Breadcrumb>
          <BreadcrumbSection active>Top</BreadcrumbSection>
        </Breadcrumb>
      </Container>
      <Divider />
      <Grid>
        <GridRow>
          <GridColumn>
            <Button
              inverted
              content="ゲームを追加する"
              floated="right"
              color="red"
              as={Link}
              to="/games/create"
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <CardGroup stackable itemsPerRow={3}>
              {gameList.map((game, index) => {
                let minName = '';
                let minMarket = '';
                let minPrice = 1e9;
                let minUrl = '';
                game.pages.forEach((page) => {
                  if (page.price < minPrice) {
                    minName = page.name;
                    minMarket = page.market;
                    minPrice = page.price;
                    minUrl = page.url;
                  }
                });

                return (
                  <Card fluid key={index}>
                    <Image
                      floated="right"
                      src={game.sumbnailUrl || '/no_image.jpg'}
                      size="tiny"
                      wrapped
                      ui={false}
                    />

                    <CardContent>
                      <CardHeader size="medium" content={game.name} />
                      <CardDescription>{game.description}</CardDescription>
                    </CardContent>
                    <CardContent extra>
                      {(() => {
                        if (minPrice === 1e9) {
                          return (
                            <Grid>
                              <GridRow>
                                <GridColumn>
                                  <Header floated="right" disabled size="small">
                                    このゲームにはまだ価格情報がありません
                                  </Header>
                                </GridColumn>
                              </GridRow>
                              <GridRow>
                                <GridColumn>
                                  <Button
                                    floated="right"
                                    color="blue"
                                    content="価格情報を追加する"
                                    as={Link}
                                    to={`/games/${game.id}/edit`}
                                  />
                                </GridColumn>
                              </GridRow>
                            </Grid>
                          );
                        } else {
                          return (
                            <Grid>
                              <GridRow>
                                <GridColumn>
                                  <Statistic
                                    floated="right"
                                    size="small"
                                    label={
                                      minName
                                        ? `${minName} - ${getStoreName(
                                            minMarket
                                          )}`
                                        : minMarket
                                    }
                                    value={`¥${minPrice.toLocaleString()}`}
                                    style={{
                                      verticalAlign: 'bottom',
                                    }}
                                  />
                                </GridColumn>
                              </GridRow>
                              <GridRow>
                                <GridColumn>
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
                                </GridColumn>
                              </GridRow>
                            </Grid>
                          );
                        }
                      })()}
                    </CardContent>
                  </Card>
                );
              })}
            </CardGroup>
          </GridColumn>
        </GridRow>
      </Grid>
    </PageWrapper>
  );
};

export default Main;
