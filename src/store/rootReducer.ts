import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slice/user';
import chatReducer from './slice/chat';

export const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});
