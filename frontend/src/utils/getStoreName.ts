const getStoreName = (market: string) => {
  switch (market) {
    case 'Nintendo':
      return 'My Nintendo Store';
    case 'PlayStation':
      return 'PS Store';
    default:
      return market;
  }
};

export default getStoreName;
