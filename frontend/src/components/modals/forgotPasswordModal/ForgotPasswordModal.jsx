import React, {useState} from "react";
import "./forgotPasswordModal.scss"
import CloseIcon from "@mui/icons-material/Close";
import {useSnackbar} from "notistack";
import {checkEmail} from "../../../utils/validator";
import {forgotPassword} from "../../../apis/users";
import {useNavigate} from "react-router-dom";

const ForgotPasswordModal = ({isShowing, hide}) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate()
    const handleForgot = async (e) => {
        e.preventDefault();
        if (checkEmail(email) || checkEmail(confirmEmail)) {
            enqueueSnackbar("Email không hợp lệ", {variant: "warning"})
        }
        if (email !== confirmEmail) {
            enqueueSnackbar("Email không khớp", {variant: "warning"})
        }
        let data = {
            email,
            phone_number: phoneNumber,
        };
        try {
            await forgotPassword(data)
            enqueueSnackbar("Yêu cầu của bạn đã được xác nhận, mật khẩu mới của bạn đã được gửi vào email", {variant: "success"})
            setPhoneNumber("")
            setEmail("");
            setConfirmEmail("");
            hide();
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant: "error"})
        }


    }
    return (
        <div className="forgot-modal">
            <div
                className={isShowing ? "modal-container show" : "modal-container hide"}
            >
                <div className={"modal-content"}>
                    <div className="close" onClick={hide}>
                        <CloseIcon/>
                    </div>
                    <h3 className="title">Quên mật khẩu</h3>
                    <form onSubmit={handleForgot}>
                        <div className="form-input">
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                name=""
                                id=""
                            />
                            <label htmlFor="">Số điện thoại</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                name=""
                                id=""
                            />
                            <label htmlFor="">Email</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                required
                                name=""
                                id=""
                            />
                            <label htmlFor="">Nhập lại email</label>
                        </div>
                        <button type="submit" className="btn-login">
                            Xác nhận
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ForgotPasswordModal;
