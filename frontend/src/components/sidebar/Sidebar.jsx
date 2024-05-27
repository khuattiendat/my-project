import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import {Link, useNavigate} from "react-router-dom";
import {DarkModeContext} from "../../context/darkModeContext";
import {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logoutFailed, logoutStart, logoutSuccess} from "../../redux/authSlice";
import {createAxios} from "../../utils/createInstance";
import {logout} from "../../apis/auth";
import {showAlertConfirm} from "../../utils/showAlert";
import {enqueueSnackbar} from "notistack";
import {encrypt} from "../../utils/crypto";

const Sidebar = () => {
    const {dispatch} = useContext(DarkModeContext);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const id = user?.data?.user.id;
    const _dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, _dispatch, logoutSuccess);
    const handleLogOut = async () => {
            const confirm = await showAlertConfirm(
                "Bạn có chắc không?",
                "Bạn muốn đăng xuất !!!"
            );
            if (confirm) {
                _dispatch(logoutStart())
                try {
                    await logout(user?.data.accessToken, axiosJWT, id);
                    enqueueSnackbar("Đăng xuất thành công", {
                        variant: "success",
                        autoHideDuration: 1000,
                    });
                    _dispatch(logoutSuccess());
                    navigate("/admin/login");
                } catch (err) {
                    enqueueSnackbar("Đăng xuất thất bại", {
                        variant: "success",
                        autoHideDuration: 1000,
                    });
                    _dispatch(logoutFailed());
                }
            }
        }
    ;
    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/admin/" style={{textDecoration: "none"}}>
                    <span className="logo">ADMIN</span>
                </Link>
            </div>
            {/* <hr /> */}
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/admin/" style={{textDecoration: "none"}}>
                        <li>
                            <DashboardIcon className="icon"/>
                            <span>Trang chủ</span>
                        </li>
                    </Link>

                    <p className="title">Danh sách</p>
                    <Link to="/admin/users" style={{textDecoration: "none"}}>
                        <li>
                            <PersonOutlineIcon className="icon"/>
                            <span>Tài khoản</span>
                        </li>
                    </Link>
                    <Link to="/admin/products" style={{textDecoration: "none"}}>
                        <li>
                            <StoreIcon className="icon"/>
                            <span>Sản phẩm</span>
                        </li>
                    </Link>
                    <Link to="/admin/categories" style={{textDecoration: "none"}}>
                        <li>
                            <CategoryIcon className="icon"/>
                            <span>Loại sản phẩm</span>
                        </li>
                    </Link>
                    <Link to={"/admin/orders"} style={{textDecoration: "none"}}>
                        <li>
                            <ShoppingCartOutlinedIcon className="icon"/>
                            <span>Đơn hàng</span>
                        </li>
                    </Link>
                    <Link to={"/admin/transactions"} style={{textDecoration: "none"}}>
                        <li>
                            <MonetizationOnOutlinedIcon className="icon"/>
                            <span>Giao dịch</span>
                        </li>
                    </Link>
                    <Link to={"/admin/banners"} style={{textDecoration: "none"}}>
                        <li>
                            <AspectRatioIcon className="icon"/>
                            <span>Banner</span>
                        </li>
                    </Link>
                    <p className="title">USEFUL</p>
                    <Link to={"/admin/statistical"} style={{textDecoration: "none"}}>
                        <li>
                            <InsertChartIcon className="icon"/>
                            <span>Thống kê</span>
                        </li>
                    </Link>

                    <p className="title">USER</p>
                    <Link to={`/admin/users/info/${encrypt(id ?? "")}`} style={{textDecoration: "none"}}>
                        <li>
                            <AccountCircleOutlinedIcon className="icon"/>
                            <span>Profile</span>
                        </li>
                    </Link>
                    <li onClick={handleLogOut}>
                        <ExitToAppIcon className="icon"/>
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div
                    className="colorOption"
                    onClick={() => dispatch({type: "LIGHT"})}
                ></div>
                <div
                    className="colorOption"
                    onClick={() => dispatch({type: "DARK"})}
                ></div>
            </div>
        </div>
    )
        ;
};

export default Sidebar;
