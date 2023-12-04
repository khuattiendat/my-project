import {useState} from "react";
import "./reset.scss";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {showAlertError} from "../../../utils/showAlert";
import {forgotPassword} from "../../../apis/users";
import {enqueueSnackbar} from "notistack";

const Reset = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleReset = async (e) => {
        e.preventDefault();
        if (email !== confirmEmail) {
            showAlertError("Email không khớp");
        }
        let data = {
            email,
            phone_number: phoneNumber,
        };
        try {
            await forgotPassword(data);
            enqueueSnackbar("Yêu cầu của bạn đã được xác nhận, mật khẩu mới của bạn đã được gửi vào email", {variant: "success"})
            navigate("/admin/login")
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {variant: "error"});
        }
    };
    return (
        <div className="reset-container">
            <div className="reset-box">
                <h2>Quên mật khẩu</h2>
                <form onSubmit={handleReset}>
                    <div className="user-box">
                        <input
                            type="text"
                            name=""
                            required
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                        />
                        <label>Số điện thoại</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="text"
                            name=""
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <label>Email</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="text"
                            name=""
                            required
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            value={confirmEmail}
                        />
                        <label>Nhập lại email</label>
                    </div>
                    <button type="submit">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Xác nhận thông tin
                    </button>
                </form>
                <Link to={"/admin/login"} className="reset">
                    <span>Đăng nhập </span>
                </Link>
            </div>
        </div>
    );
};
export default Reset;
