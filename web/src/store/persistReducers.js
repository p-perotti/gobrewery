import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persistedReducer = persistReducer(
    {
      key: 'gobrewery',
      storage,
      whitelist: ['auth', 'avatar'],
    },
    reducers
  );

  return persistedReducer;
};
