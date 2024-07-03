import "./new.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import {useDispatch, useSelector} from "react-redux";
import FormInput from "../../../components/formInput/FormInput";
import {useEffect} from "react";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";

const New = ({...props}) => {
    const {inputs, title, type} = props;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            enqueueSnackbar("Vui lòng đăng nhập để tiếp tục", {variant: "error"});
            navigate("/admin/login");
        }
    }, []);

    return (
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar/>
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <FormInput
                        inputs={inputs}
                        type={type}
                    />
                </div>
            </div>
        </div>
    );
};

export default New;
