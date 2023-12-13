import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RollType } from '../types/roll';

export type UserState = {
 value: {
    _id: string | null,
    username: string | null,
    token: string | null,
    rolls: RollType[] | null
 };
};

export type UserStatePayloadAction = {
      _id: string | null,
      username: string | null,
      token: string | null,
      rolls: RollType[] | null
   };

const initialState: UserState = {
 value: { _id: null, username: null , token: null, rolls: null},
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
   updateUser: (state: UserState, action: PayloadAction<UserStatePayloadAction>) => { // Je ne suis pas du tout sure que ce soit la bonne manière de typer.
     state.value = action.payload;
   },
 },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;