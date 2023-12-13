import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RollType } from '../types/roll';

export type UserState = {
 value: {
    _id: string | null,
    username: string | null,
    token: string | null,
    rolls: RollType[]
 };
};

export type UserStatePayloadAction = {
      _id: string | null,
      username: string | null,
      token: string | null,
      rolls: RollType[]
   };

const initialState: UserState = {
 value: { _id: null, username: null , token: null, rolls: []},
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserStatePayloadAction>) => { // Je ne suis pas du tout sure que ce soit la bonne manière de typer.
      state.value = action.payload;
    },
    addRoll: (state: UserState, action: PayloadAction<RollType>) => {
      state.value.rolls.push(action.payload);  
    },
    removeRoll: (state, action) => {
      state.value.rolls = state.value.rolls.filter(e => e.name !== action.payload);
    },
    importRolls: (state, action) => {
      state.value.rolls = action.payload
    }
 },
});

export const { updateUser, addRoll, removeRoll, importRolls } = userSlice.actions;
export default userSlice.reducer;