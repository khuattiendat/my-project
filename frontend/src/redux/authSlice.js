import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    login: {
        isFetching: false,
        currentUser: null,
        error: false,
    }
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
            state.login.error = false;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
            state.login.error = false;
        },
        logoutSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
    }
})
export const {
    loginStart,
    loginSuccess,
    loginFailed,
    logoutStart,
    logoutFailed,
    logoutSuccess
} = authSlice.actions;
export default authSlice.reducer;