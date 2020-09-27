import React, { useEffect, useState } from 'react';
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
  BreadcrumbSection,
  BreadcrumbDivider,
  Grid,
  GridRow,
  GridColumn,
} from 'semantic-ui-react';
import PageWrapper from '../components/PageWrapper';
import { useParams } from 'react-router';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Link } from 'react-router-dom';
import GameInfo from '../models/GameInfo';
import getStoreName from '../utils/getStoreName';

interface MarketHistory {
  date: string;
  price: number;
}

interface GameHistory {
  [url: string]: MarketHistory[];
}

interface HistoryRaw {
  [url: string]: {
    date: number;
    price: number;
  }[];
}

const GameInfoPage: React.FC = () => {
  const id = useParams<{ id: string }>().id;

  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory>({});

  useEffect(() => {
    firestore
      .collection('games')
      .doc(id)
      .get()
      .then((doc) => {
        const info = doc.data() as GameInfo;
        info.pages.sort((a, b) => a.price - b.price);
        setGameInfo(info);
      });
    firestore
      .collection('history')
      .doc(id)
      .get()
      .then((doc) => {
        const historyRaw = doc.data() as HistoryRaw;
        const history = {} as GameHistory;
        Object.keys(historyRaw).forEach((key) => {
          history[key] = [];
          historyRaw[key].forEach((h) => {
            history[key].push({
              date: new Date(h.date * 1000).toLocaleDateString(),
              price: h.price,
            });
          });
          history[key].reverse();
          if (history[key].length > 0) {
            history[key].push({
              date: new Date().toLocaleDateString(),
              price: history[key].slice(-1)[0].price,
            });
          }
        });
        setGameHistory(history);
      })
      .catch((e) => {});
  }, [id]);

  return (
    <PageWrapper>
      <Container textAlign="left">
        <Breadcrumb>
          <BreadcrumbSection link as={Link} to="/">
            Top
          </BreadcrumbSection>
          <BreadcrumbDivider icon="right angle" />
          <BreadcrumbSection active>{gameInfo?.name}</BreadcrumbSection>
        </Breadcrumb>
      </Container>
      <Divider />
      <Grid>
        <GridRow>
          <GridColumn>
            <Image
              floated="left"
              src={
                gameInfo
                  ? gameInfo.sumbnailUrl || '/no_image.jpg'
                  : '/no_image.jpg'
              }
              size="medium"
            />
            <Header floated="left" size="large">
              {gameInfo?.name}
              <Header.Subheader>{gameInfo?.description}</Header.Subheader>
            </Header>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Button
              inverted
              color="blue"
              content="公式サイト"
              as="a"
              target="_blank"
              href={gameInfo?.officialUrl}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Divider />
            <Button
              as={Link}
              to={`${id}/edit`}
              color="blue"
              content="情報を編集する"
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            {gameInfo?.pages.map((page, index) => {
              return (
                <Card fluid key={index}>
                  <CardContent>
                    <Header
                      size="huge"
                      floated="left"
                      content={
                        page.name
                          ? `${page.name} - ${getStoreName(page.market)}`
                          : page.market
                      }
                    />
                    <Statistic
                      floated="right"
                      size="tiny"
                      value={`¥${page.price.toLocaleString()}`}
                    />
                  </CardContent>
                  <CardContent>
                    <Button
                      color="teal"
                      content="ストアに行く"
                      floated="right"
                      as="a"
                      target="_blank"
                      href={page.url}
                    />
                  </CardContent>
                  <CardContent>
                    <div style={{ height: 200 }}>
                      <ResponsiveContainer width="95%">
                        <LineChart data={gameHistory[page.url] || []}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#8884d8"
                            isAnimationActive={false}
                          />
                          <CartesianGrid stroke="#ccc" />
                          <XAxis dataKey="date" />
                          <YAxis />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Divider />
            <Breadcrumb>
              <BreadcrumbSection link as={Link} to="/">
                Top
              </BreadcrumbSection>
              <BreadcrumbDivider icon="right angle" />
              <BreadcrumbSection active>{gameInfo?.name}</BreadcrumbSection>
            </Breadcrumb>
          </GridColumn>
        </GridRow>
      </Grid>
    </PageWrapper>
  );
};

export default GameInfoPage;
