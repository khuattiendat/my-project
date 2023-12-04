import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../../components/widget/Widget";
import Featured from "../../../components/featured/Featured";
import Chart from "../../../components/chart/Chart";
import Table from "../../../components/table/Table";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import {getAllUsers} from "../../../apis/users";
import {getAllProducts} from "../../../apis/products";
import {getAllOrder} from "../../../apis/orders";
import {
    getAllTransaction,
    getLatestTransaction,
} from "../../../apis/transactions";

const Home = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [isFetching, setIsFetching] = useState(false);
    const [total, setTotal] = useState({});
    const [dataTransaction, setDataTransaction] = useState([]);
    const componentMounted = useRef(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const fetchApi = async () => {
        try {
            let total = {};
            let dataTransaction = [];
            setIsFetching(true);
            const lisUser = await getAllUsers(user?.data.accessToken, 1, "", axiosJWT);
            const lisOrder = await getAllOrder(user?.data.accessToken, 1, "", axiosJWT);
            const listTransaction = await getAllTransaction(
                user?.data.accessToken,
                1,
                "",
                axiosJWT
            );
            const listLateTransaction = await getLatestTransaction(
                user?.data.accessToken,
                axiosJWT
            );
            dataTransaction = await listLateTransaction;
            const listProduct = await getAllProducts();
            total.totalUser = await lisUser.totalUser;
            total.totalProduct = await listProduct.totalProducts;
            total.totalOrder = await lisOrder.totalOrder;
            total.totalTransaction = await listTransaction.totalTransaction;
            setDataTransaction(dataTransaction);
            setTotal(total);
            setIsFetching(false);
        } catch (error) {
            setIsFetching(false);
            console.log(error);
        }
    };
    useEffect(() => {
        document.title = "Home";
        if (!user) {
            navigate("/admin/login");
        }
        fetchApi();
        return () => (componentMounted.current = false);
    }, []);
    return (
        <div className="home-admin">
            <Sidebar/>
            <div className="homeContainer">
                <Navbar/>
                <div className="widgets">
                    <Widget isFetching={isFetching} total={total} type="user"/>
                    <Widget isFetching={isFetching} total={total} type="product"/>
                    <Widget isFetching={isFetching} total={total} type="order"/>
                    <Widget isFetching={isFetching} total={total} type="transaction"/>
                </div>
                <div className="charts">
                    <Featured/>
                    <Chart title="Last 6 Months (Revenue)" aspect={2 / 1}/>
                </div>
                <div className="listContainer">
                    <div className="listTitle">Giao dịch mới nhất</div>
                    <Table data={dataTransaction} type="users" isFetching={isFetching}/>
                </div>
            </div>
        </div>
    );
};

export default Home;
