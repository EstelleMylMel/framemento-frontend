import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RollType } from '../types/roll';
import { FrameType } from '../types/frame';

export type UserState = {
 value: {
    _id: string | null,
    username: string | null,
    token: string | null,
    rolls: RollType[],
    framesShared: FrameType[]
 };
};

export type UserStatePayloadAction = {
      _id: string | null,
      username: string | null,
      token: string | null,
      rolls: RollType[],
      framesShared: FrameType[] | []
   };

const initialState: UserState = {
 value: { _id: '657cb4ed44e8fef9bfdd5a32', username: 'a4' , token: 'Q4ClOAPx4RburGyrtTttQachqLSqNfUj', rolls: [], framesShared: []},
};

export const userSlice = createSlice({
 name: 'user',
 initialState,
 reducers: {
    updateUser: (state: UserState, action: PayloadAction<UserStatePayloadAction>) => {
      state.value = action.payload;
    },
    addRoll: (state: UserState, action: PayloadAction<RollType>) => {
      state.value.rolls.push(action.payload);  
    },
    removeRoll: (state: UserState, action: PayloadAction<string>) => {
      state.value.rolls = state.value.rolls.filter(e => e.name !== action.payload);
    },
    importRolls: (state, action) => {
      state.value.rolls = action.payload
    },
    addFrameShared: (state: UserState, action: PayloadAction<FrameType>) => {
      state.value.framesShared.push(action.payload);  
    },
    removeFrameShared: (state, action) => {
      state.value.framesShared = state.value.framesShared.filter(e => e._id !== action.payload);
    },
    importFramesShared: (state, action) => {
      state.value.framesShared = action.payload
    },
 },
});

export const { updateUser, addRoll, removeRoll, importRolls, addFrameShared, removeFrameShared, importFramesShared } = userSlice.actions;
export default userSlice.reducer;