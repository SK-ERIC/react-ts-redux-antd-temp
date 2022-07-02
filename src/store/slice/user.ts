import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  token: string;
  username: string;
  avatar: string;
  permission: string[];
}

const initialState: UserState = {
  token: '',
  username: '',
  avatar: '',
  permission: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<UserState['token']>) {
      state.token = action.payload;
    },
    setUsername(state, action: PayloadAction<UserState['username']>) {
      state.username = action.payload;
    },
    setAvatar(state, action: PayloadAction<UserState['avatar']>) {
      state.avatar = action.payload;
    },
    setPermission(state, action: PayloadAction<UserState['permission']>) {
      state.permission = action.payload;
    },
  },
});

export const { setToken, setUsername, setAvatar, setPermission } = userSlice.actions;
export default userSlice.reducer;
