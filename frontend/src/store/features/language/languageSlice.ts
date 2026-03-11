import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum AppLanguages {
    English,
    Ukrainian,
}

export interface ILanguageState {
    language: {
        fullName: string;
        shortName: string;
    };
}

const initialState: ILanguageState = {
    language: {
        fullName: 'English',
        shortName: 'en',
    },
};

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setAppLanguage(
            state: ILanguageState,
            action: PayloadAction<AppLanguages>
        ) {
            switch (action.payload) {
                case AppLanguages.English:
                    state.language = {
                        fullName: 'English',
                        shortName: 'en',
                    };
                    break;
                case AppLanguages.Ukrainian:
                    state.language = {
                        fullName: 'Ukrainian',
                        shortName: 'ua',
                    };
                    break;
            }
        },
    },
});

export const { setAppLanguage } = languageSlice.actions;

export default languageSlice.reducer;
