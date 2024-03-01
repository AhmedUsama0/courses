import { configureStore, createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore
} from "redux-persist";

// create user slice
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {}
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = {};
        },
        updateImage: (state, action) => {
            state.user = { ...state.user, image: action.payload };
        }
    }
});
const persistedConfig = {
    key: "main-root",
    storage
};
const persistedReducer = persistReducer(persistedConfig, userSlice.reducer)
// create redux store and configure it
export const store = configureStore({
    reducer: {
        user: persistedReducer
    },
    middleware: (getDefaultMiddleWare) => {
        return getDefaultMiddleWare({
            serializableCheck: {
                ignoreActions: [FLUSH, PERSIST, REHYDRATE, REGISTER, PAUSE, PURGE]
            }
        })
    }
});
export const persistor = persistStore(store);

// destructre login and logout actions from userSlice
export const { login, logout, updateImage } = userSlice.actions;
