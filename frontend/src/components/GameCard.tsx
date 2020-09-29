import React from 'react';
import {
  Button,
  Card,
  CardContent,
  Statistic,
  Image,
  CardHeader,
  CardDescription,
  ButtonGroup,
  GridRow,
  Grid,
  GridColumn,
  Header,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import getStoreName from '../utils/getStoreName';
import Game from '../types/game';

const GameCard: React.FC<{ game: Game }> = ({ game }) => {
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
    <Card fluid>
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
                          ? `${minName} - ${getStoreName(minMarket)}`
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
};

export default GameCard;
