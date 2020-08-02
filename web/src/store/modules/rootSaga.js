import { all } from 'redux-saga/effects';

import auth from './auth/sagas';
import avatar from './avatar/sagas';

export default function* rootSaga() {
  return yield all([auth, avatar]);
}
