import "./single.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import List from "../../../components/table/Table";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getTransactionById, getTransactionByUserId,} from "../../../apis/transactions";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import Info from "../../../components/Info/Info";
import {getUserById} from "../../../apis/users";
import {getListImages, getProductById} from "../../../apis/products";
import {getCategoryById} from "../../../apis/category";
import {getOrderById, getOrderDetailByOrderId} from "../../../apis/orders";
import {decrypt} from "../../../utils/crypto";
import {getBannerById} from "../../../apis/banner";
import LoadingPage from "../../../components/Loading/loadingPage/LoadingPage";
import {enqueueSnackbar} from "notistack";

const Single = (props) => {
    const params = useParams();
    const {type} = props;
    const {id} = params;
    const ids = decrypt(id);
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [dataTransaction, setDataTransaction] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataOrder, setDataOrder] = useState([]);
    const [listImageProduct, setImage] = useState([]);
    const dispatch = useDispatch();
    const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    useEffect(async () => {
        const fetchApi = async () => {
            let data;
            if (type === "users") {
                try {
                    setLoading(true)
                    let dataTransaction;
                    const listTransaction = await getTransactionByUserId(
                        user?.data.accessToken,
                        1,
                        ids,
                        axiosJWT
                    );
                    data = await getUserById(user?.data.accessToken, ids, axiosJWT);
                    dataTransaction = listTransaction.transactions;
                    setDataTransaction(dataTransaction);
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }

            } else if (type === "products") {
                try {
                    setLoading(true)
                    const res = await getProductById(ids);
                    const listImages = await getListImages(ids);
                    setImage(listImages);
                    data = res;
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }

            } else if (type === "categories") {
                try {
                    setLoading(true)
                    data = await getCategoryById(ids);
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }
            } else if (type === "orders") {
                try {
                    setLoading(true)
                    let dataOrder;
                    const res = await getOrderById(user?.data.accessToken, ids, axiosJWT);
                    dataOrder = await getOrderDetailByOrderId(
                        user?.data.accessToken,
                        ids,
                        axiosJWT
                    );
                    setDataOrder(dataOrder);
                    data = res;
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    enqueueSnackbar("Không tìm thấy dữ liệu", {variant: "error", autoHideDuration: 1000})
                    console.log(error);
                }

            } else if (type === "transactions") {
                try {
                    setLoading(true)
                    data = await getTransactionById(
                        user?.data.accessToken,
                        ids,
                        axiosJWT
                    );
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }

            } else if (type === "banners") {
                try {
                    setLoading(true)
                    const res = await getBannerById(ids);
                    let dataRes = res?.data?.data;
                    setImage([dataRes]);
                    data = dataRes;
                    setLoading(false)
                } catch (error) {
                    setLoading(false)
                    console.log(error);
                }

            }
            setData(data);
        };
        await fetchApi();
    }, [id]);
    return (
        <div className="single">
            <Sidebar/>
            <div className="singleContainer">
                <Navbar/>
                <div style={{marginTop: "60px"}}>
                    <div className="top">
                        <div className="left">
                            <Info
                                image={listImageProduct[0]}
                                data={data}
                                type={type}
                                orderDetail={dataOrder}
                                id={id}
                                loading={loading}
                            />
                        </div>
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
                    {type === "products" ? (
                        <div className="bottom">
                            <div className="show-img">
                                <h1 className="title">Danh sách hình ảnh</h1>
                                {loading ? <LoadingPage/> : (
                                    listImageProduct.map((item, index) => (
                                        <img
                                            key={index}
                                            src={`${BASE_URL}uploads/${item.image_url}`}
                                            alt="images"
                                            className="images"
                                        />
                                    ))
                                )}

                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Single;
