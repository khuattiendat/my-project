import "./single.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import List from "../../../components/table/Table";
import {useNavigate, useParams} from "react-router-dom";
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
import Loading from "../../../components/Loading/Loading";
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
    const [listImageProduct, setListImageProduct] = useState([]);
    const [image, setImage] = useState(null);
    const dispatch = useDispatch();
    const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const navigate = useNavigate();
    const fetchApi = async () => {
        let data;
        let res;
        let dataTransaction;
        let listImages;
        let dataOrder;
        let image;
        try {
            switch (type) {
                case "users":
                    setLoading(true);
                    const listTransaction = await getTransactionByUserId(
                        user?.data.accessToken,
                        1,
                        ids,
                        axiosJWT
                    );
                    data = await getUserById(user?.data.accessToken, ids, axiosJWT);
                    dataTransaction = listTransaction.transactions;
                    break;
                case "products":
                    setLoading(true);
                    res = await getProductById(ids);
                    listImages = await getListImages(ids);
                    image = listImages[0];
                    data = res;
                    break;
                case "orders":
                    setLoading(true);
                    res = await getOrderById(user?.data.accessToken, ids, axiosJWT);
                    dataOrder = await getOrderDetailByOrderId(
                        user?.data.accessToken,
                        ids,
                        axiosJWT
                    );
                    data = res;
                    break;
                case "categories":
                    setLoading(true)
                    data = await getCategoryById(ids);
                    break;
                case "banners":
                    setLoading(true)
                    res = await getBannerById(ids);
                    let dataRes = res?.data?.data;
                    image = dataRes;
                    data = dataRes;
                    break;
                case "transactions":
                    setLoading(true);
                    data = await getTransactionById(
                        user?.data.accessToken,
                        ids,
                        axiosJWT
                    );
                default:
                    setLoading(false)
                    break;

            }
            setData(data);
            setDataTransaction(dataTransaction)
            setListImageProduct(listImages)
            setDataOrder(dataOrder);
            setImage(image);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (!user) {
            enqueueSnackbar("Vui lòng đăng nhập", {variant: "error"});
            navigate("/admin/login")
        }
        fetchApi();
    }, [id, type]);
    return (
        <div className="single">
            <Sidebar/>
            <div className="singleContainer">
                <Navbar/>
                <div style={{marginTop: "60px"}}>
                    <div className="top">
                        <div className="left">
                            <Info
                                image={image}
                                data={data}
                                type={type}
                                orderDetail={dataOrder}
                                id={id}
                            />
                        </div>
                    </div>

                    {type === "users" && (
                        <div className="bottom">
                            <h1 className="title">Giao dịch gần đây</h1>
                            {
                                loading ? <Loading/> : <List data={dataTransaction} type="users"/>
                            }
                        </div>
                    )}
                    {type === "orders" && (
                        <div className="bottom">
                            <h1 className="title">Danh sách sản phẩm</h1>
                            {
                                loading ? <Loading/> : <List data={dataOrder} type="orders"/>
                            }
                        </div>
                    )}
                    {type === "products" && (
                        <div className="bottom">
                            <div className="show-img">
                                <h1 className="title">Danh sách hình ảnh</h1>
                                {listImageProduct?.map((item, index) => (
                                    <img
                                        key={index}
                                        src={`${BASE_URL}uploads/${item.image_url}`}
                                        alt="images"
                                        className="images"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Single;
