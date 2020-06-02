import { combineReducers } from 'redux';

import auth from './auth/reducers';
import ui from './ui/reducers';

export default combineReducers({ auth, ui });
