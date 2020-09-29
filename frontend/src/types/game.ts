import GamePage from './gamePage';

interface Game {
  id: string;
  name: string;
  description: string;
  officialUrl: string;
  sumbnailUrl: string;
  pages: GamePage[];
}

export default Game;
