import {useEffect, useState} from "react";
import "./login.scss";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import * as ReactDOM from "react-dom";
import Loading from "../../../components/Loading/Loading";
import {loginAdmin} from "../../../apis/auth";
import {enqueueSnackbar} from "notistack";

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const {isFetching} = useSelector((state) => state.auth.login);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const newUser = {
            phone_number: phoneNumber,
            password: password,
        };
        let dataLogin = await loginAdmin(newUser, dispatch);
        if (dataLogin.error === 0) {
            enqueueSnackbar("Đăng nhập thành công", {variant: "success", autoHideDuration: 1000});
            navigate("/admin");
        } else {
            enqueueSnackbar("Đăng nhập thất bại", {variant: "error", autoHideDuration: 1000});
        }
    };
    useEffect(() => {
        document.title = "Login Admin";
    }, []);
    return (
        <div className="login">
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="user-box">
                            <input
                                type="text"
                                name=""
                                required
                                autoComplete
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                value={phoneNumber}
                            />
                            <label>Số điện thoại</label>
                        </div>
                        <div className="user-box">
                            <input
                                type="password"
                                name=""
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <label>Mật khẩu</label>
                        </div>
                        <button type="submit">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Đăng nhập
                        </button>
                    </form>
                    <Link to={"/admin/reset"} className="reset">
                        <span>Quên mật khẩu </span>
                    </Link>
                </div>
                {isFetching && <Loading/>}
            </div>
        </div>
    );
};

export default Login;
