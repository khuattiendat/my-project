import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import React, {useEffect, useState} from "react";
import {createAxios} from "../../../utils/createInstance";
import {useDispatch, useSelector} from "react-redux";
import {loginSuccess} from "../../../redux/authSlice";
import {getOrderByUserId, getOrderDetailByOrderId} from "../../../apis/orders";
import "./order.scss"
import {Link} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {DataGrid} from "@mui/x-data-grid";
import {orderColumnClient} from "../../../datatablesource";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {formatDate, formatPrice} from "../../../utils/format";
import {checkStatusDelivery, checkStatusPayment} from "../../../utils/checkStatus";
import Loading from "../../../components/Loading/Loading";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {encrypt} from "../../../utils/crypto";

const Order = () => {
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
    //
    const [sort, setSort] = useState("latest");

    const handleChange = (event) => {
        setSort(event.target.value);
    };
    const fetchListOrders = async (q) => {
        try {
            setLoadOrder(true)
            let data = await getOrderByUserId(user?.data.accessToken, userId, axiosJWT, page, q, sort)
            setListOrder(data?.orders)
            setTotalPage(data?.totalPage)
            data?.orders.map((row, i) => {
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
        await fetchListOrders("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
            left: 0,
        });
    }, [])
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
                    {loadOrderDetail ? <Loading/> : (
                        <div className={"left_content"}>
                            {listOrderDetail ?
                                listOrderDetail.map((item, index) => {
                                    return (
                                        <div className={"left_content-item"} key={index}>
                                            <div className={"left_content-item-img"}>
                                                <Link to={`/product/${encrypt(item.product.id)}`}>
                                                    <img src={`${BASE_URL_SERVER}/uploads/${item.product.image}`}/>
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
                                : null}
                        </div>
                    )}

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
                        {loadOrder ? <Loading/> : (
                            <>
                                {listOrder && (
                                    <DataGrid
                                        autoHeight
                                        className="datagrid"
                                        rows={listOrder}
                                        columns={orderColumnClient}
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
                                    disabled={page <= 1 ? true : false}
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
                                    disabled={page >= totalPage ? true : false}
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