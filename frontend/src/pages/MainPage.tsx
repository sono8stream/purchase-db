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
  Search,
  Radio,
  Transition,
  Segment,
  List,
  ListItem,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { Link } from 'react-router-dom';
import PickUp from '../components/PickUp';
import Game from '../types/game';
import GameCard from '../components/GameCard';
import StandardSearch from '../components/GameSearch';
import GameSearch from '../components/GameSearch';

const Main: React.FC = () => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [viewAll, setViewAll] = useState(false);

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
            <Segment>
              <Header size="medium" content="GameDB!とは？" />
              <Divider />
              GameDB!は，複数のプラットフォームで発売されるゲームの価格推移を閲覧するサービスです．
              <br />
              <br />
              気になっている
              <span style={{ fontWeight: 'bold' }}>ゲームを検索</span>
              してみましょう！
              <br />
              <br />
              あるいは，気になっている
              <span style={{ fontWeight: 'bold' }}>ゲームを追加</span>
              してみましょう！
            </Segment>
          </GridColumn>
        </GridRow>
        <GridRow columns={2}>
          <GridColumn>
            <GameSearch games={gameList} />
          </GridColumn>
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
            <PickUp games={gameList.filter((game, idx) => idx < 2)} />
          </GridColumn>
        </GridRow>
        {viewAll ? (
          <>
            <GridRow>
              <GridColumn>
                <Button
                  inverted
                  color="green"
                  content="折りたたむ"
                  onClick={() => setViewAll(false)}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn>
                <CardGroup stackable itemsPerRow={3}>
                  {gameList.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </CardGroup>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn>
                <Button
                  inverted
                  color="green"
                  content="折りたたむ"
                  onClick={() => setViewAll(false)}
                />
              </GridColumn>
            </GridRow>
          </>
        ) : (
          <GridRow>
            <GridColumn>
              <Button
                inverted
                color="purple"
                content="すべて見る"
                onClick={() => setViewAll(true)}
              />
            </GridColumn>
          </GridRow>
        )}
      </Grid>
    </PageWrapper>
  );
};

export default Main;
