import Home from "./pages/admin/home/Home";
import Login from "./pages/admin/login/Login";
import List from "./pages/admin/list/List";
import Single from "./pages/admin/single/Single";
import New from "./pages/admin/new/New";
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import {categoruInput, productInputs, userInputs} from "./formSource";
import "./style/dark.scss";
import {useContext} from "react";
import {DarkModeContext} from "./context/darkModeContext";
import Reset from "./pages/admin/reset/Reset";
import NotFound from "./pages/admin/NotFound/NotFound";
import Edit from "./pages/admin/edit/Edit";
import {routesConfigClient} from "./routes/client.routes";
import {routesConfigAdmin} from "./routes/admin.routes";

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
    )
        ;
}

export default App;
