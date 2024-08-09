import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import React, {useEffect, useState} from "react";
import {createAxios} from "../../../utils/createInstance";
import {useDispatch, useSelector} from "react-redux";
import {loginSuccess} from "../../../redux/authSlice";
import {getOrderByUserId, getOrderDetailByOrderId, updateOrder} from "../../../apis/orders";
import "./order.scss"
import {Link, useLocation, useNavigate} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {DataGrid} from "@mui/x-data-grid";
import {orderColumnClient} from "../../../datatablesource";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {formatDate, formatPrice} from "../../../utils/format";
import {checkStatusDelivery, checkStatusPayment} from "../../../utils/checkStatus";
import LoadingPage from "../../../components/Loading/loadingPage/LoadingPage";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {encrypt} from "../../../utils/crypto";
import {enqueueSnackbar} from "notistack";
import {showAlertConfirm} from "../../../utils/showAlert";

const Order = () => {
    const state = useLocation();
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?.data.user.id;
    const [orderId, setOrderId] = useState("");
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [listOrder, setListOrder] = useState([]);
    const [listOrderDetail, setListOrderDetail] = useState([]);
    const [loadOrderDetail, setLoadOrderDetail] = useState(false);
    const [loadOrder, setLoadOrder] = useState(false);
    const [valueSearch, setValueSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [columns, setColumns] = useState([]);
    //
    const navigate = useNavigate()
    const [sort, setSort] = useState("latest");
    const actionColumn = [
        {
            field: "action",
            headerName: "xác nhận đơn hàng",
            width: 250,
            renderCell: (params) => {
                const status = params.row.status_delivery;
                return (
                    <div className="cellAction">
                        <button
                            className={
                                status === "Chưa giao"
                                    ? ""
                                    : "disabled"
                            }
                            disabled={status !== "Chưa giao"}
                            onClick={() => handleDelete(params.row.id, status)}
                        >
                            Hủy đơn hàng
                        </button>
                        <button
                            className={
                                status === "Đang giao hàng"
                                    ? ""
                                    : "disabled"
                            }
                            disabled={status !== "Đang giao hàng"}
                            onClick={() => handleUpdateOrder(params.row.id, status)}
                        >
                            Đã nhận được hàng
                        </button>
                    </div>
                );
            },
        },
    ]
    const handleUpdateOrder = async (id, status) => {
        const confirm = await showAlertConfirm("Bạn có chắc chắn muốn xác nhận đã nhận hàng không?", "");
        if (confirm) {
            let _data = {
                id: id,
                status_delivery: 2,
                status_payment: 1
            }
            try {
                await updateOrder(user?.data?.accessToken, _data, navigate, axiosJWT);
                navigate(`/users/order`, {
                    state: id,
                });
                enqueueSnackbar("Cập nhật thành công", {variant: "success", autoHideDuration: 1000})
            } catch (err) {
                console.log(err);
            }
        }
    }
    const handleDelete = async (id, status) => {
        if (status === "Đang giao hàng" || status === "Giao hàng thành công") {
            enqueueSnackbar("Không thể hủy đơn hàng đã giao", {variant: "error"});
            return;
        }
        const confirm = await showAlertConfirm("Bạn có chắc chắn muốn hủy đơn hàng này không?", "");
        if (confirm) {
            let _data = {
                id: id,
                status_delivery: 3,
                status_payment: null
            }
            try {
                await updateOrder(user?.data?.accessToken, _data, navigate, axiosJWT);
                navigate(`/users/order`, {
                    state: id,
                });
                enqueueSnackbar("Cập nhật thành công", {variant: "success", autoHideDuration: 1000})
            } catch (err) {
                console.log(err);
            }
        }
    }
    const handleChange = (event) => {
        setSort(event.target.value);
    };
    const fetchListOrders = async (q) => {
        try {
            setLoadOrder(true)
            let data = await getOrderByUserId(user?.data.accessToken, userId, axiosJWT, page, q, sort)
            setListOrder(data?.orders)
            setTotalPage(data?.totalPage)
            data?.orders.map((row) => {
                row.createdAt = formatDate(row.createdAt);
                row.total_money = formatPrice(row.total_money);
                row.status_payment = checkStatusPayment(row.status_payment)
                row.status_delivery = checkStatusDelivery(row.status_delivery)
            });
            setLoadOrder(false)
        } catch (err) {
            setLoadOrder(false)
            console.log(err);
        }
    }
    const fetchOrderDetail = async () => {
        setLoadOrderDetail(true)
        try {
            let data = await getOrderDetailByOrderId(user?.data.accessToken, orderId, axiosJWT)
            setListOrderDetail(data);
            setLoadOrderDetail(false)
        } catch (err) {
            setLoadOrderDetail(false)
            console.log(err);
        }
    }
    useEffect(async () => {
        setColumns(orderColumnClient.concat(actionColumn));
        await fetchListOrders("");
        document.title = "Đơn hàng";
        window.scrollTo({
            top: 0,
            behavior: "smooth",
            left: 0,
        });
    }, [state])
    useEffect(async () => {
            await fetchListOrders(valueSearch);
        }
        , [page, sort]);
    useEffect(async () => {
        if (orderId !== "") {
            await fetchOrderDetail();
        }
    }, [orderId]);

    const handleSearhSubmit = async (e) => {
        e.preventDefault();
        await fetchListOrders(valueSearch);

    }
    return (
        <>
            <Header/>
            <div className={"order-container"}>
                <div className={"left"}>
                    <h2 className={"title"}>Chi tiết đơn hàng</h2>
                    <div className={"left_content"}>
                        {loadOrderDetail ? <LoadingPage/> : (
                            <>
                                {listOrderDetail &&
                                    listOrderDetail.map((item, index) => {
                                        return (
                                            <div className={"left_content-item"} key={index}>
                                                <div className={"left_content-item-img"}>
                                                    <Link to={`/product/${encrypt(item.product.id)}`}>
                                                        <img alt={"image"}
                                                             src={`${BASE_URL_SERVER}/uploads/${item.product.image}`}/>
                                                    </Link>
                                                </div>
                                                <div className={"left_content-item-info"}>
                                                    <div className={"left_content-item-info-name"}>
                                                        <Link to={`/product/${encrypt(item.product.id)}`}>
                                                            <span>Tên sản phẩm: </span>{item.product.name}
                                                        </Link>

                                                    </div>
                                                    <div className={"left_content-item-info-price"}>
                                                        <span>Giá:</span> {formatPrice(item.price)}
                                                    </div>
                                                    <div className={"left_content-item-info-quantity"}>
                                                        <span>Số lượng:</span>{item.quantity}
                                                    </div>
                                                    <div className={"left_content-item-info-cost"}>
                                                        <span>Giá gốc:</span>{formatPrice(item.product.price)}
                                                    </div>
                                                    <div className={"left_content-item-info-money"}>
                                                        <span>Thành tiền:</span> {formatPrice(item.total_money)}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </>
                        )}
                    </div>

                </div>
                <div className={"right"}>
                    <div className={"right_header"}>
                        <h2 className={"title"}>
                            Danh sách đơn hàng
                        </h2>
                        <form action="" onSubmit={handleSearhSubmit}>
                            <input type="text" value={valueSearch}
                                   onChange={(e) => setValueSearch(e.target.value)}
                                   placeholder={"Tìm kiếm đơn hàng ..."}/>
                            <button type="submit">
                                <SearchIcon/>
                            </button>
                        </form>
                        <div className={"right_header-sort"}>
                            <FormControl sx={{m: 1, minWidth: 120}} size="small">
                                <InputLabel id="demo-select-small-label">Sắp xếp</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={sort}
                                    label="sắp xếp"
                                    onChange={handleChange}
                                >
                                    <MenuItem selected value={"latest"}>Mới nhất</MenuItem>
                                    <MenuItem value={"oldest"}>Cũ nhất</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <div className={"right_content"}>
                        {loadOrder ? <LoadingPage/> : (
                            <>
                                {listOrder && (
                                    <DataGrid
                                        autoHeight
                                        className="datagrid"
                                        rows={listOrder}
                                        columns={columns}
                                        pageSize={9}
                                        rowsPerPageOptions={[9]}
                                        onRowClick={(e) => {
                                            setOrderId(e.row.id)
                                        }}
                                        hideFooter
                                    />
                                )}
                            </>

                        )}


                    </div>
                    <div className="pagination">
                        <ul>
                            <li>
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((page) => page - 1)}
                                >
                                    <ChevronLeftIcon className="icon"/>
                                </button>
                            </li>
                            <li>
                                <span>{page}</span>
                            </li>
                            <li>
                                <span>/</span>
                            </li>
                            <li>
                                <span>{totalPage}</span>
                            </li>
                            <li>
                                <button
                                    disabled={page >= totalPage}
                                    onClick={() => setPage((page) => page + 1)}
                                >
                                    <ChevronRightIcon className="icon"/>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )

}
export default Order;