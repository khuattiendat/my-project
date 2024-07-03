import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./statistical.scss"
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {enqueueSnackbar} from "notistack";

const Statistical = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            enqueueSnackbar("Vui lòng đăng nhập để tiếp tục", {variant: "error"});
            navigate("/admin/login");
        }
    }, []);
    return (
        <div className={"statistical"}>
            <Sidebar/>
            <div className="statisticalContainer">
                <Navbar/>

            </div>
        </div>
    );
}
export default Statistical;