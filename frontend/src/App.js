import {BrowserRouter, Routes, Route,} from "react-router-dom";
import "./style/dark.scss";
import {useContext} from "react";
import {DarkModeContext} from "./context/darkModeContext";
import {routesConfigClient} from "./routes/client.routes";
import {routesConfigAdmin} from "./routes/admin.routes";
import DialogFlow from "./components/dialogFlow/DialogFlow";

function App() {
    const {darkMode} = useContext(DarkModeContext);
    return (
        <div className={darkMode ? "app dark" : "app"}>
            <BrowserRouter>
                <Routes>
                    {routesConfigClient.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element}>
                            {route.children.map((child, index) => (
                                <Route key={index} path={child.path} element={child.element}/>
                            ))}
                        </Route>
                    ))}
                    {routesConfigAdmin.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element}>
                            {route.children.map((child, index) => (
                                <Route key={index} path={child.path} element={child.element}/>
                            ))}
                        </Route>
                    ))}
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
