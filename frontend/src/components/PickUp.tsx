import React from 'react';
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

const PickUp: React.FC<{ games: Game[] }> = ({ games }) => {
  return (
    <>
      <Header content="Pick Up!" />
      <CardGroup stackable itemsPerRow={games.length as any}>
        {games.map((game, idx) => (
          <GameCard game={game} />
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
