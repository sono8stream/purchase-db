import MarketPage from './MarketPage';

export default interface GameInfo {
  name: string;
  description: string;
  officialUrl: string;
  sumbnailUrl: string;
  pages: MarketPage[];
}
