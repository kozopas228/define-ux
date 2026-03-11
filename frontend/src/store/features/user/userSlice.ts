import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/user';

export interface IUserState {
    user: User | null;
}

const initialState: IUserState = {
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAppUser(state: IUserState, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
    },
});

export const { setAppUser } = userSlice.actions;

export default userSlice.reducer;
