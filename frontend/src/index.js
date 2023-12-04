import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Provider} from "react-redux";
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'
import store from './redux/store';
import {SnackbarProvider, useSnackbar} from 'notistack';
import {DarkModeContextProvider} from "./context/darkModeContext";
import GlobalStyles from "./components/globalStyles/GlobalStyles";

let persistor = persistStore(store)
ReactDOM.render(
    <SnackbarProvider maxSnack={3} anchorOrigin={{vertical: "top", horizontal: "right"}}>
        <Provider store={store}>
            <GlobalStyles>
                <DarkModeContextProvider>
                    <PersistGate persistor={persistor}>
                        <App/>
                    </PersistGate>
                </DarkModeContextProvider>
            </GlobalStyles>
        </Provider>
    </SnackbarProvider>,

    document.getElementById("root")
);
