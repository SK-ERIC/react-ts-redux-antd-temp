import { createSelector } from '@reduxjs/toolkit';
import { RootState, store } from '..';

export const selectToken = createSelector(
  (state: RootState) => state.user.token,
  (token) => token
);

export const peekToken = () => store.getState().user.token;
