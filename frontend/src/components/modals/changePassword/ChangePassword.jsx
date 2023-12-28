import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";
import "./changePassword.scss"
import {useSnackbar} from "notistack";
import {resetPassword} from "../../../apis/users";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";


const ChangePassword = ({isShowing, hide}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const id = user?.data.user.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const handleChangePassword = async (e) => {
        e.preventDefault();
        let data = {
            oldPassword,
            newPassword,
        }
        if (newPassword !== confirmPassword) {
            enqueueSnackbar("Mật khẩu mới không khớp!!!", {variant: "warning", autoHideDuration: 1000})
            return
        }
        try {
            await resetPassword(user?.data.accessToken, data, axiosJWT, id)
            enqueueSnackbar("Đổi mật khẩu thành công", {variant: "success", autoHideDuration: 1000})
            setConfirm("")
            setOldPassword("")
            setNewPassword("")
            hide();
        } catch (err) {
            console.log(err)
            enqueueSnackbar("Mật khẩu cũ không đúng!!!", {variant: "warning", autoHideDuration: 1000})
        }


    }
    return (
        <div className={"change_password_modal"}>
            <div
                className={isShowing ? "modal-container show" : "modal-container hide"}
            >
                <div className="modal-content">
                    <div className="close" onClick={hide}>
                        <CloseIcon/>
                    </div>
                    <h3 className="title">Đổi mật khẩu</h3>
                    <form action="" onSubmit={handleChangePassword}>
                        <div className="form-input">
                            <input
                                type="text"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="">Mật khẩu cũ</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="">Mật khẩu mới</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            <label htmlFor="">Nhập lại mật khẩu mới</label>
                        </div>
                        <button type="submit" className="btn-login">
                            Xác nhận
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default ChangePassword;