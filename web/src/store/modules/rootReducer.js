import { combineReducers } from 'redux';

import ui from './ui/reducers';
import auth from './auth/reducers';
import avatar from './avatar/reducers';

export default combineReducers({ ui, auth, avatar });
