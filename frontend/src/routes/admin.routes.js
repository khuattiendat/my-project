import Home from "../pages/admin/home/Home";
import Login from "../pages/admin/login/Login";
import List from "../pages/admin/list/List";
import Single from "../pages/admin/single/Single";
import New from "../pages/admin/new/New";
import NotFound from "../pages/admin/NotFound/NotFound";
import Edit from "../pages/admin/edit/Edit";
import {categoruInput, productInputs, userInputs} from "../formSource";
import Reset from "../pages/admin/reset/Reset";

export const routesConfigAdmin = [
    {
        path: "/admin/",
        element: <Home/>,
        children: []
    },
    {
        path: "/admin/login",
        element: <Login/>,
        children: []
    },
    {
        path: "/admin/reset",
        element: <Reset/>,
        children: []
    },
    // users
    {
        path: "/admin/users",
        element: <List type={"users"} title="Danh sách tài khoản"/>,
        children: []
    },
    {
        path: "/admin/users/new",
        element: <New inputs={userInputs} title={"Thêm mới user"} type={"users"}/>,
        children: []
    },
    {
        path: "/admin/users/edit/:id",
        element: <Edit inputs={userInputs} title={"Sửa thông tin user"} type={"users"}/>,
        children: []
    },
    {
        path: "/admin/users/info/:id",
        element: <Single type={"users"}/>,
        children: []
    },
    // products
    {
        path: "/admin/products",
        element: <List type={"products"} title="Danh sách sản phẩm"/>,
        children: []
    },
    {
        path: "/admin/products/new",
        element: <New inputs={productInputs} title={"Thêm mới sản phẩm"} type={"products"}/>,
        children: []
    },
    {
        path: "/admin/products/edit/:id",
        element: <Edit inputs={productInputs} title={"Sửa thông tin user"} type={"products"}/>,
        children: []
    },
    {
        path: "/admin/products/info/:id",
        element: <Single type={"products"}/>,
        children: []
    },
    // categories
    {
        path: "/admin/categories",
        element: <List type={"categories"} title="Danh sách danh mục"/>,
        children: []
    },
    {
        path: "/admin/categories/new",
        element: <New inputs={categoruInput} title={"Thêm mới danh mục"} type={"categories"}/>,
        children: []
    },
    {
        path: "/admin/categories/edit/:id",
        element: <Edit inputs={categoruInput} title={"Sửa thông tin danh mục"} type={"categories"}/>,
        children: []
    },
    {
        path: "/admin/categories/info/:id",
        element: <Single type={"categories"}/>,
        children: []
    },
    // orders
    {
        path: "/admin/orders",
        element: <List type={"orders"} title="Danh sách đơn hàng"/>,
        children: []
    },
    {
        path: "/admin/orders/info/:id",
        element: <Single type={"orders"}/>,
        children: []
    },
    // transactions
    {
        path: "/admin/transactions",
        element: <List type={"transactions"} title="Danh sách giao dịch"/>,
        children: []
    },
    {
        path: "/admin/transactions/info/:id",
        element: <Single type={"transactions"}/>,
        children: []
    },
    // not found
    {
        path: "*",
        element: <NotFound/>,
        children: []
    },

]