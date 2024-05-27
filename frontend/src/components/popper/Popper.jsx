import React, {useState} from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LockResetIcon from "@mui/icons-material/LockReset";
import {Link, useNavigate} from "react-router-dom";
import "tippy.js/dist/tippy.css";
import "./popper.scss";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../../utils/createInstance";
import {loginSuccess, logoutStart, logoutSuccess} from "../../redux/authSlice";
import {showAlertConfirm, showAlertError} from "../../utils/showAlert";
import {logout} from "../../apis/auth";
import {resetPassword} from "../../apis/users";
import {enqueueSnackbar} from "notistack";
import {encrypt} from "../../utils/crypto";
import {LoadingButton} from "@mui/lab";

const Popper = () => {
    const [openModal, setOpenModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const id = user?.data.user.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const handleLogOut = async () => {
        const confirm = await showAlertConfirm('Bạn có chắc không?', "Bạn muốn đăng xuất !!!");
        if (confirm) {
            dispatch(logoutStart());
            try {
                await logout(user?.data.accessToken, axiosJWT, id);
                enqueueSnackbar("Đăng xuất thành công", {variant: "success", autoHideDuration: 1000});
                dispatch(logoutSuccess());
                navigate("/admin/login");
            } catch (err) {
                enqueueSnackbar("Đăng xuất thất bại", {variant: "success", autoHideDuration: 1000});
                dispatch(logoutSuccess());
            }
        }
    };
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const accessToken = user?.data.accessToken;
        const userId = user?.data.user.id;
        if (newPassword !== confirmNewPassword) {
            showAlertError("Mật khẩu không khớp");
        }
        let data = {
            oldPassword,
            newPassword,
        };
        try {
            setLoading(true);
            await resetPassword(accessToken, data, axiosJWT, userId);
            enqueueSnackbar("Đổi mật khẩu thành công", {variant: "success", autoHideDuration: 1000});
            navigate("/admin");
            setOpenModal(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err)
            err.response.data.message.forEach(mess => {
                enqueueSnackbar(mess, {variant: "warning", autoHideDuration: 1000});
            })
        }

    };
    return (
        <>
            <div className="popper_container">
                <ul>
                    <Link to={`/admin/users/info/${encrypt(id ?? "")}`}>
                        <li>
                            <AccountCircleOutlinedIcon/>
                            <span>Profile</span>
                        </li>
                    </Link>
                    <li onClick={() => setOpenModal(!openModal)}>
                        <LockResetIcon/>
                        <span>Đổi mật khẩu</span>
                    </li>
                    <li onClick={handleLogOut}>
                        <ExitToAppIcon/>
                        <span>Đăng xuất</span>
                    </li>
                </ul>
            </div>
            {openModal && (
                <div className="modal">
                    <div className="modal_container">
                        <div
                            className="modal_close"
                            onClick={() => setOpenModal(!openModal)}
                        >
                            <CloseIcon/>
                        </div>
                        <div className="modal_body">
                            <h2>Đổi mật khẩu</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className="form_input">
                                    <label htmlFor="">Mật khẩu cũ</label>
                                    <input
                                        type="password"
                                        required
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        value={oldPassword}
                                    />
                                </div>
                                <div className="form_input">
                                    <label htmlFor="">Mật khẩu mới</label>
                                    <input
                                        type="password"
                                        required
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                    />
                                </div>
                                <div className="form_input">
                                    <label htmlFor="">Nhập lại mật khẩu mới</label>
                                    <input
                                        type="password"
                                        required
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        value={confirmNewPassword}
                                    />
                                </div>
                                <LoadingButton style={{
                                    color: "white",
                                    fontSize: "16px",
                                    padding: "10px 20px",
                                    textTransform: "capitalize"
                                }} loading={loading} variant={"outlined"} type={"submit"}>
                                    Cập nhật
                                </LoadingButton>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popper;
