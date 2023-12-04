import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {CSSTransition, Transition} from "react-transition-group";
import "./loginModal.scss";
import CloseIcon from "@mui/icons-material/Close";
import {Link, useNavigate} from "react-router-dom";
import {loginUser} from "../../../apis/auth";
import {SnackbarProvider, useSnackbar} from "notistack";
import {useDispatch} from "react-redux";
import useModal from "../../../hooks/useModal";
import ForgotPasswordModal from "../forgotPasswordModal/ForgotPasswordModal";
import RegisterModal from "../registerModal/RegisterModal";

const LoginModal = ({show, hide}) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isforgotPassword, setForgotPassword] = useState(false);
    const [isregister, setRegister] = useState(false);
    const {isShowing, toggle} = useModal();
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            phone_number: phoneNumber,
            password: password,
        };
        let dataLogin = await loginUser(newUser, dispatch, navigate)
        if (dataLogin.error === 0) {
            enqueueSnackbar("Đăng nhập thành công", {variant: "success", autoHideDuration: 1000});
            setPassword("");
            setPhoneNumber("");
            hide();
        } else {
            enqueueSnackbar(dataLogin.message, {variant: "error", autoHideDuration: 1000});
        }
    };
    return (
        <div className="login-modal">
            <div className={show ? "modal-container show" : "modal-container hide"}>
                <div className="modal-content">
                    <div className="close" onClick={hide}>
                        <CloseIcon/>
                    </div>
                    <h3 className="title">Đăng nhập</h3>
                    <form onSubmit={handleLogin}>
                        <div className="form-input">
                            <input
                                type="text"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                name=""
                                id=""
                            />
                            <label htmlFor="">Số điện thoại</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                name=""
                                id=""
                            />
                            <label htmlFor="">Mật khẩu</label>
                        </div>
                        <button type="submit" className="btn-login">
                            Đăng nhập
                        </button>
                    </form>

                    <div className="login-footer">
            <span className="forgot" onClick={() => {
                setForgotPassword(true);
                setRegister(false)
                hide();
                toggle()

            }}>
              Quên mật khẩu?
            </span>
                        <span style={{display: "flex"}}>
              Nếu bạn chưa có tài khoản.
              <p
                  style={{
                      color: "#000",
                      fontWeight: "bold",
                      marginLeft: "10px",
                  }}
                  onClick={() => {
                      setForgotPassword(false);
                      setRegister(true)
                      hide();
                      toggle()

                  }}
              >
                Đăng ký ngay
              </p>
            </span>
                    </div>
                </div>
            </div>
            {isforgotPassword && <ForgotPasswordModal isShowing={isShowing} hide={toggle}/>}
            {isregister && <RegisterModal isShowing={isShowing} hide={toggle}/>}
        </div>
    )
        ;
};

export default LoginModal;
