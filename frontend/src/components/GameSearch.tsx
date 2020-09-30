import _ from 'lodash';
import React, { useReducer, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';
import Game from '../types/game';

interface SearchResult {
  title: string;
  description: string;
  image: string;
  price: string;
  id: string;
}

interface SearchState {
  loading: boolean;
  results: SearchResult[];
  value: string;
}

const initialState: SearchState = {
  loading: false,
  results: [],
  value: '',
};

const reducer: (state: SearchState, action: any) => SearchState = (
  state: SearchState,
  action: any
) => {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState;
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query as string };
    case 'FINISH_SEARCH':
      return {
        ...state,
        loading: false,
        results: action.results.map((game: Game) => {
          let minPrice = 1e9;
          game.pages.forEach((page) => {
            if (page.price < minPrice) {
              minPrice = page.price;
            }
          });
          return {
            title: game.name,
            description: game.description,
            image: game.sumbnailUrl || '/no_image.jpg',
            price: minPrice === 1e9 ? '価格情報がありません' : `¥${minPrice}`,
            id: game.id,
          };
        }),
      };
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection };

    default:
      throw new Error();
  }
};

const GameSearch: React.FC<{ games: Game[] }> = ({ games }) => {
  const history = useHistory();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, results, value } = state;

  const handleSearchChange = useCallback(
    (e, data) => {
      dispatch({ type: 'START_SEARCH', query: data.value });

      setTimeout(() => {
        if (data.value.length === 0) {
          dispatch({ type: 'CLEAN_QUERY' });
          return;
        }

        const re = new RegExp(_.escapeRegExp(data.value), 'i');
        const isMatch = (result: Game) => re.test(result.name);

        dispatch({
          type: 'FINISH_SEARCH',
          results: _.filter(games, isMatch),
        });
      }, 300);
    },
    [games]
  );

  const onResultSelect = (result: SearchResult) => {
    if (result.price.startsWith('¥')) {
      history.push(`/games/${result.id}`);
    } else {
      history.push(`/games/${result.id}/edit`);
    }
  };

  return (
    <Search
      loading={loading}
      onResultSelect={(e, data) => onResultSelect(data.result)}
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
    />
  );
};

export default GameSearch;
