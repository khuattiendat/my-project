import Cart from "../pages/client/cart/Cart";
import HomeClient from "../pages/client/Home/Home";
import Product from "../pages/client/product/Product";
import Category from "../pages/client/category/Category";
import Payment from "../pages/client/Payment/Payment";
import Order from "../pages/client/order/Order";
import Profile from "../pages/client/profile/Profile";

export const routesConfigClient = [
    {
        path: "/",
        element: <HomeClient/>,
        children: []
    },
    {
        path: "/cart",
        element: <Cart/>,
        children: []
    },
    {
        path: "/product/:id",
        element: <Product/>,
        children: []
    },
    {
        path: "/categories/:id",
        element: <Category/>,
        children: []
    },
    {
        path: "/payment",
        element: <Payment/>,
        children: []
    },
    {
        path: "users/order",
        element: <Order/>,
        children: []
    },
]