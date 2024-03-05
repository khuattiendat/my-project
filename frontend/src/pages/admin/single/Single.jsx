import "./single.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Chart from "../../../components/chart/Chart";
import List from "../../../components/table/Table";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    getTransactionById,
    getTransactionByUserId,
} from "../../../apis/transactions";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import Info from "../../../components/Info/Info";
import {getUserById} from "../../../apis/users";
import {getListImages, getProductById} from "../../../apis/products";
import {getCategoryById} from "../../../apis/category";
import {getOrderById, getOrderDetailByOrderId} from "../../../apis/orders";
import CryptoJS from "crypto-js";
import {decrypt} from "../../../utils/crypto";
import {getBannerById} from "../../../apis/banner";

const Single = (props) => {
    const params = useParams();
    const {type} = props;
    const {id} = params;
    const ids = decrypt(id);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [dataTransaction, setDataTransaction] = useState([]);
    const [data, setData] = useState({});
    const [dataOrder, setDataOrder] = useState([]);
    const [listImageProduct, setImage] = useState([]);
    const dispatch = useDispatch();
    const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    useEffect(() => {
        const fetchApi = async () => {
            let data;
            if (type === "users") {
                try {
                    let dataTransaction;
                    const listTransaction = await getTransactionByUserId(
                        user?.data.accessToken,
                        1,
                        ids,
                        axiosJWT
                    );
                    const res = await getUserById(user?.data.accessToken, ids, axiosJWT);
                    data = res;
                    dataTransaction = listTransaction.transactions;
                    setDataTransaction(dataTransaction);
                } catch (error) {
                    console.log(error);
                }

            } else if (type === "products") {
                const res = await getProductById(ids);
                const listImages = await getListImages(ids);
                setImage(listImages);
                data = res;
            } else if (type === "categories") {
                const res = await getCategoryById(ids);
                data = res;
            } else if (type === "orders") {
                let dataOrder;
                const res = await getOrderById(user?.data.accessToken, ids, axiosJWT);
                const orderDetail = await getOrderDetailByOrderId(
                    user?.data.accessToken,
                    ids,
                    axiosJWT
                );
                dataOrder = orderDetail;
                setDataOrder(dataOrder);
                data = res;
            } else if (type === "transactions") {
                const res = await getTransactionById(
                    user?.data.accessToken,
                    ids,
                    axiosJWT
                );
                data = res;
            } else if (type === "banners") {
                const res = await getBannerById(ids);
                let dataRes = res?.data?.data;
                setImage([dataRes]);
                data = dataRes;
            }
            setData(data);
        };
        fetchApi();
    }, [id]);
    return (
        <div className="single">
            <Sidebar/>
            <div className="singleContainer">
                <Navbar/>
                <div className="top">
                    <div className="left">
                        <Info
                            image={listImageProduct[0]}
                            data={data}
                            type={type}
                            orderDetail={dataOrder}
                            id={id}
                        />
                    </div>
                    {/*{type === "users" && (*/}
                    {/*    <div className="right">*/}
                    {/*        <Chart*/}
                    {/*            aspect={3 / 1}*/}
                    {/*            title="Chi tiêu của tài khoản trong 6 tháng qua"*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>

                {type === "users" && (
                    <div className="bottom">
                        <h1 className="title">Giao dịch gần đây</h1>
                        <List data={dataTransaction} type="users"/>
                    </div>
                )}
                {type === "orders" && (
                    <div className="bottom">
                        <h1 className="title">Danh sách sản phẩm</h1>
                        <List data={dataOrder} type="orders"/>
                    </div>
                )}
                {type == "products" ? (
                    <div className="bottom">
                        <div className="show-img">
                            <h1 className="title">Danh sách hình ảnh</h1>
                            {listImageProduct.map((item, index) => (
                                <img
                                    key={index}
                                    src={`${BASE_URL}uploads/${item.image_url}`}
                                    alt="images"
                                    className="images"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Single;
