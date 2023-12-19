import Home from "./pages/admin/home/Home";
import HomeClient from "./pages/client/Home/Home";
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
import Cart from "./pages/client/cart/Cart";
import Product from "./pages/client/product/Product";
import Category from "./pages/client/category/Category";
import Payment from "./pages/client/Payment/Payment";
import Order from "./pages/client/order/Order";
import Profile from "./pages/client/profile/Profile";

function App() {
    const {darkMode} = useContext(DarkModeContext);
    console.log(productInputs)
    return (
        <div className={darkMode ? "app dark" : "app"}>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<HomeClient/>}/>
                        <Route path={"payment"} element={<Payment/>}/>
                        <Route path={"users"}>
                            <Route path={"order"} element={<Order/>}/>
                            <Route path={"profile"} element={<Profile/>}/>
                        </Route>
                        <Route path={"cart"} element={<Cart/>}/>
                        <Route path="product">
                            <Route path={":id"} element={<Product/>}/>
                        </Route>
                        <Route path="categories">
                            <Route path={":id"} element={<Category/>}/>
                        </Route>
                    </Route>
                    <Route path="/admin/">
                        <Route index element={<Home/>}/>
                        <Route path="login" element={<Login/>}/>
                        <Route path="reset" element={<Reset/>}/>
                        <Route path="users">
                            <Route index element={<List isUser type={"users"} title="Danh sách tài khoản"/>}/>
                            <Route path="info">
                                <Route path=":id" element={<Single type="users"/>}/>
                            </Route>
                            <Route path="edit">
                                <Route path=":id"
                                       element={<Edit title={"cập nhật thông tin tài khoản"} inputs={userInputs}
                                                      type={"users"}/>}/>
                            </Route>
                            <Route
                                path="new"
                                element={<New inputs={userInputs} type="users" title="Thêm tài khoản mới"/>}
                            />
                        </Route>
                        <Route path="products">
                            <Route index
                                   element={<List isProduct type={"products"} title="Danh sách các sản phẩm"/>}/>
                            <Route path="info">
                                <Route path=":id" element={<Single type="products"/>}/>
                            </Route>
                            <Route path="edit">
                                <Route path=":id"
                                       element={<Edit title={"cập nhật thông tin sản phẩm"} inputs={productInputs}
                                                      type={"products"}/>}/>
                            </Route>
                            <Route
                                path="new"
                                element={<New inputs={productInputs} type="products" title="Thêm sản phẩm mới"/>}
                            />
                        </Route>
                        <Route path="categories">
                            <Route index element={<List isCategory type={"categories"}
                                                        title="Danh sách các loại sản phẩm"/>}/>
                            <Route path="info">
                                <Route path=":id" element={<Single type="categories"/>}/>
                            </Route>
                            <Route path="edit">
                                <Route path=":id"
                                       element={<Edit title={"cập nhật thông tin loại sản phẩm"}
                                                      inputs={categoruInput}
                                                      type={"categories"}/>}/>
                            </Route>
                            <Route
                                path="new"
                                element={<New inputs={categoruInput} type="categories"
                                              title="Thêm loại sản phẩm mới"/>}
                            />
                        </Route>
                        <Route path="orders">
                            <Route index element={<List isOrder type={"orders"} title="Danh sách các đơn hàng"/>}/>
                            <Route path="info">
                                <Route path=":id" element={<Single type={"orders"}/>}/>
                            </Route>
                        </Route>
                        <Route path="transactions">
                            <Route index element={<List isTransaction type={"transactions"}
                                                        title="Danh sách các giao dịch"/>}/>
                            <Route path="info">
                                <Route path=":id" element={<Single type={"transactions"}/>}/>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" index element={<NotFound/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
