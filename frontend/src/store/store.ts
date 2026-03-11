import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counter/counterSlice';
import languageSlice from './features/language/languageSlice';
import userSlice from './features/user/userSlice';

export const store = configureStore({
    reducer: {
        counterReducer: counterReducer,
        languageReducer: languageSlice,
        userReducer: userSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
