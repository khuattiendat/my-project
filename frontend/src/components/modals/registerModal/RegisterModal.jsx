import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";
import "./registerModal.scss"
import {addUser} from "../../../apis/users";
import {useNavigate} from "react-router-dom";
import {useSnackbar} from "notistack";
import {checkEmail, checkPhone} from "../../../utils/validator";

const RegisterModal = ({isShowing, hide}) => {
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState(0)
    const handleRegister = async (e) => {
        e.preventDefault();
        if (checkEmail(email)) {
            enqueueSnackbar("Email không hợp lệ", {variant: "warning"})
            return
        }
        if (checkPhone(phoneNumber)) {
            enqueueSnackbar("Số điện thạo không hợp lệ", {variant: "warning"})
            return;
        }
        let data = {
            name: name,
            email: email,
            password: password,
            phone_number: phoneNumber,
            gender: gender,
            address: address,
            role_id: 1,
        }
        try {
            await addUser(data)
            enqueueSnackbar("Đăng ký tài khoản thành công", {variant: "success", autoHideDuration: 1000})
            hide();
            setPhoneNumber("")
            setEmail("")
            setName("")
            setPassword("")
            setGender(0)
            setAddress("")
        } catch (error) {
            error.response.data.message.forEach((message) => {
                enqueueSnackbar(message, {variant: "error"})
            })
        }


    }
    return (
        <div className={"register-modal"}>
            <div
                className={isShowing ? "modal-container show" : "modal-container hide"}
            >
                <div className={"modal-content"}>
                    <div className="close" onClick={hide}>
                        <CloseIcon/>
                    </div>
                    <h3 className="title">Đăng ký</h3>
                    <form className={"form"} onSubmit={handleRegister}>
                        <div className="form-input">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                name=""
                                id=""
                            />
                            <label htmlFor="">Họ và tên</label>
                        </div>
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
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                name=""
                                id=""
                            />
                            <label htmlFor="">Email</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                name=""
                                id=""
                            />
                            <label htmlFor="">Địa chỉ</label>
                        </div>
                        <div className="form-input">
                            <input
                                type="text"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                name=""
                                id=""
                            />
                            <label htmlFor="">Mật khẩu</label>
                        </div>
                        <div className={"form-input"}>
                            <span htmlFor="">Giới tính</span>
                            <select name="" id="" style={{width: "100%"}} onChange={(e) => setGender(e.target.value)}>
                                <option selected={gender === 1} value={1}>Nam</option>
                                <option selected={gender === 0} value={0}>Nữ</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-login">
                            Đăng ký
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default RegisterModal;