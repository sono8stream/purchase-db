const getStoreName = (market: string) => {
  switch (market) {
    case 'Nintendo':
      return 'ニンテンドーストア';
    case 'PlayStation':
      return 'PSストア';
    case 'amazon':
      return 'Amazon';
    default:
      return market;
  }
};

export default getStoreName;
