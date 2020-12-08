import { combineReducers } from 'redux';

import ui from './ui/reducers';
import auth from './auth/reducers';
import user from './user/reducers';

export default combineReducers({ ui, auth, user });
