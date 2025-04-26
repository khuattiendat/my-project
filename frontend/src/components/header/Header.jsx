import {Link, useNavigate} from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from '@mui/icons-material/Search';
import "./header.scss";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import LoginModal from "../modals/loginModal/LoginModal";
import useModal from "../../hooks/useModal";
import {createAxios} from "../../utils/createInstance";
import {showAlertConfirm} from "../../utils/showAlert";
import {logoutStart, logoutSuccess} from "../../redux/authSlice";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {logout} from "../../apis/auth";
import {useSnackbar} from "notistack";
import ChangePassword from "../modals/changePassword/ChangePassword";
import MenuCategory from "../menu/menuCategory/MenuCategory";
import {getAllCategory} from "../../apis/category";
import {encrypt} from "../../utils/crypto";


const Header = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const getProductByLocalStore = useSelector((state) => state.product.product?.listProduct);
    const {isShowing, toggle} = useModal();
    const id = user?.data.id;
    const _dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, _dispatch, logoutSuccess);
    const [searchValue, setSearchValue] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLogin, setLogin] = useState(false)
    const [isChange, setChange] = useState(false)
    const [listCategory, setListCategory] = useState([])
    const [initId, setInitId] = useState(null)
    const fetchApis = async () => {
        let listCategory = await getAllCategory()
        setListCategory(listCategory);
        setInitId(listCategory[0]?.id);
    }
    useEffect(async () => {
        await fetchApis();
    }, []);
    const handleLogout = async () => {
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
                navigate("/");
            } catch (err) {
                _dispatch(logoutSuccess());
                enqueueSnackbar("Đăng xuất thất bại", {
                    variant: "success",
                    autoHideDuration: 1000,
                });
            }
        }
    };
    const handleOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSubmitSearch = (e) => {
        e.preventDefault()
        if (searchValue === "") return;
        navigate("/search?q=" + searchValue)
    }
    const open = Boolean(anchorEl);
    const id_open = open ? 'simple-popover' : undefined;
    return (
        <div className="header">
            <div className="header_top">
                <div className="left">
                    <ul>
                        <li>
                            <Link to={""}>
                                <LocationOnIcon fontSize="14px"/>
                                <span>Cửa hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <PhoneIcon fontSize="14px"/>
                                <span>0383878902</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""}>
                                <TripOriginIcon fontSize="14px"/>
                                <span>Trả Góp 0% Lãi Suất</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="right">
                    <ul>
                        <li>
                            <Link>
                                <span style={{paddingRight: "4px"}}>Danh sách yêu thích</span>
                                <FavoriteIcon fontSize="14px"/>
                            </Link>
                        </li>
                        <li>
                            {!user ? (
                                <span onClick={() => {
                                    setChange(false)
                                    setLogin(true)
                                    toggle()
                                }}>Đăng nhập</span>
                            ) : (
                                <span aria-describedby={id_open} style={{fontWeight: "bold"}} variant="contained"
                                      onClick={handleOpen}>
                  {user?.data.user.name}
                </span>
                            )}
                            <div>
                                <Popover
                                    id={id_open}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    style={{
                                        marginTop: "6px",
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                >
                                    <Typography
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#3ac2cc !important"
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "#666666d9"
                                        }}
                                        style={{
                                            minWidth: "150px",
                                            cursor: "pointer",
                                            padding: "4px 12px",
                                            borderBottom: "1px solid #ccc"
                                        }} sx={{p: 2}}>
                                        <Link className={"right_header_link"}
                                              onMouseOver={(e) => {
                                                  e.currentTarget.style.color = "#3ac2cc"
                                              }}
                                              onMouseOut={(e) => {
                                                  e.currentTarget.style.color = "#666666d9"
                                              }}
                                              style={{textDecoration: "none", color: "#666666d9"}}
                                              to={"/users/order"}>
                                            Đơn hàng của bạn
                                        </Link>
                                    </Typography>
                                    <Typography
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#3ac2cc"
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "#666666d9"
                                        }}
                                        onClick={() => {
                                            setLogin(false)
                                            setChange(true)
                                            toggle()
                                            handleClose()
                                        }}
                                        style={{
                                            minWidth: "150px",
                                            cursor: "pointer",
                                            padding: "4px 12px",
                                            borderBottom: "1px solid #ccc",
                                        }} sx={{p: 2}}>Đổi mật khẩu</Typography>
                                    <Typography
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = "#3ac2cc"
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = "#666666d9"
                                        }}
                                        onClick={() => {
                                            handleLogout();
                                            handleClose();
                                        }} style={{
                                        cursor: "pointer",
                                        padding: "4px 12px",
                                        borderBottom: "1px solid #ccc"
                                    }} sx={{p: 2}}>Đăng xuất</Typography>
                                </Popover>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            {isLogin && <LoginModal show={isShowing} hide={toggle}/>}
            {isChange && <ChangePassword isShowing={isShowing} hide={toggle}/>}
            <div className={"header_main"}>
                <div className={"left"}>
                    <form action="" onSubmit={handleSubmitSearch}>
                        <input type="text"
                               onChange={(e) => setSearchValue(e.target.value)}
                               value={searchValue}
                               placeholder={"Tìm kiếm trang sức"}/>
                        <button type={"submit"}>
                            <SearchIcon fontSize={"medium"}/>
                        </button>
                    </form>
                </div>
                <div className={"logo"}>
                    <Link to={"/"}>
                        <img src="/images/logo.png" alt=""/>
                    </Link>
                </div>
                <div className={"right"}>
                    <Link to={"/cart"}>
                        <span className={"title"}>
                        Giỏ hàng
                        </span>
                        <span className={"icon"}>
                            <strong>
                                {getProductByLocalStore?.length}
                            </strong>
                        </span>
                    </Link>


                </div>
            </div>
            <div className={"header_bottom"}>
                <ul className={"header_bottom_list"}>
                    <li className={"header_bottom-item active"}>
                        <Link className={"header_bottom_link"} to={"/"}>Home</Link>
                    </li>
                    <li className={"header_bottom-item category"} style={{position: "relative"}}>
                        <Link className={"header_bottom_link"}

                              to={initId && `/categories/${encrypt(initId)}`}
                        >

                            Sản phẩm</Link>
                        <MenuCategory data={listCategory}/>
                    </li>
                    <li className={"header_bottom-item"}>
                        <Link className={"header_bottom_link"} to={""}>Tin tức</Link>
                    </li>
                    <li className={"header_bottom-item"}>
                        <Link className={"header_bottom_link"} to={""}>Giới thiệu</Link>
                    </li>
                    <li className={"header_bottom-item"}>
                        <Link className={"header_bottom_link"} to={""}>Liên hệ</Link>
                    </li>
                </ul>
            </div>
            <div className="header_bottom-mb">

            </div>
        </div>
    );
};
export default Header;
