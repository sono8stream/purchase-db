import React, { useEffect, useState } from 'react';
import {
  Dot,
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import {
  Button,
  ButtonGroup,
  CardGroup,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Radio,
  Statistic,
} from 'semantic-ui-react';
import Game from '../types/game';
import GameCard from './GameCard';

const PickUp: React.FC<{ games: Game[]; pickUpCnt: number }> = ({
  games,
  pickUpCnt,
}) => {
  const [pickUps, setPickUps] = useState<Game[]>([]);

  useEffect(() => {
    let list = games.slice();
    if (list.length > pickUpCnt) {
      const filtered = [];
      let i = 0;
      let len = list.length;
      while (i < pickUpCnt) {
        const idx = Math.floor(Math.random() * len);
        filtered.push(list[idx]);
        len--;
        list[idx] = list[len];
        i++;
      }
      list = filtered;
    }
    setPickUps(list);
  }, [games, pickUpCnt]);

  return (
    <>
      <CardGroup stackable doubling itemsPerRow={pickUpCnt as any}>
        {pickUps.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </CardGroup>
      {/*
      <CarouselProvider
        naturalSlideWidth={1}
        naturalSlideHeight={1}
        totalSlides={games.length}
      >
        <Slider>
          {games.map((game, idx) => (
            <Slide index={idx} key={game.id}>
              <GameCard game={game} />
            </Slide>
          ))}
        </Slider>
        <ButtonGroup style={{ textAlign: 'center' }}>
          {games.map((game, idx) => (
            <Button as={Dot} key={`${game.id}!`} icon="circle" slide={idx} />
          ))}
        </ButtonGroup>
      </CarouselProvider>
          */}
    </>
  );
};

export default PickUp;
