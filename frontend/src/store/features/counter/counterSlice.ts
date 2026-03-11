import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ICounterState {
    value: number;
}

const initialState: ICounterState = {
    value: 0,
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementCounter(state: ICounterState) {
            state.value += 1;
        },
        decrementCounter(state: ICounterState) {
            state.value -= 1;
        },
        incrementCounterByAmount(
            state: ICounterState,
            action: PayloadAction<number>
        ) {
            state.value += action.payload;
        },
    },
});

export const { incrementCounter, decrementCounter, incrementCounterByAmount } =
    counterSlice.actions;

export default counterSlice.reducer;
