import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
 value: {
    username: string | null,
    token: string | null,
 };
};

export type UserStatePayloadAction = {
       username: string | null,
       token: string | null,
   };

const initialState: UserState = {
 value: { username: null , token: null },
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