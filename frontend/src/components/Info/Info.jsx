import React, {useEffect, useState} from "react";
import "./info.scss";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {formatPrice} from "../../utils/format";
import {decrypt, encrypt} from "../../utils/crypto";
import {checkGender, checkPaymentMethod, checkStatusDelivery, checkStatusPayment} from "../../utils/checkStatus";
import {updateOrder} from "../../apis/orders";
import {useSelector} from "react-redux";
import {createAxios} from "../../utils/createInstance";
import {loginSuccess} from "../../redux/authSlice";

const Info = (props) => {
    const {data, type, id, image} = props;
    const {state} = useLocation();
    const BASE_URL = process.env.REACT_APP_BASE_URL_SERVER;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [listItem, setListItem] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const dispatch = useNavigate();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const navigate = useNavigate()
    const dataUser = (data) => [
        {
            itemKey: "Họ và tên",
            itemValue: data?.name,
        },
        {
            itemKey: "email",
            itemValue: data?.email,
        },
        {
            itemKey: "Số điện thoại",
            itemValue: data?.phone_number,
        },
        {
            itemKey: "Địa chỉ",
            itemValue: data?.address,
        },
        {
            itemKey: "Giới tính",
            itemValue: checkGender(data?.gender),
        },
        {
            itemKey: "Ngày đăng ký",
            itemValue: new Date(data?.createdAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
        {
            itemKey: "Ngày cập nhật",
            itemValue: new Date(data?.updatedAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
    ];
    const dataProduct = (data) => [
        {
            itemKey: "Tên sản phẩm",
            itemValue: data?.name,
        },
        {
            itemKey: "Loại sản phẩm",
            itemValue: data?.Category ? data?.Category.name : "",
        },
        {
            itemKey: "Giá",
            itemValue: formatPrice(data?.price),
        },
        {
            itemKey: "Giảm giá",
            itemValue: data?.discount + "%",
        },
        {
            itemKey: "Mô tả",
            itemValue: data?.description,
        },
        {
            itemKey: "Số lượng",
            itemValue: data?.quantity,
        },
        {
            itemKey: "Ngày tạo",
            itemValue: new Date(data?.createdAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
        {
            itemKey: "Ngày cập nhật",
            itemValue: new Date(data?.updatedAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
    ];
    const dataCategory = (data) => [
        {
            itemKey: "Tên loại sản phẩm",
            itemValue: data?.name,
        },
        {
            itemKey: "Ngày tạo",
            itemValue: new Date(data?.createdAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
        {
            itemKey: "Ngày cập nhật",
            itemValue: new Date(data?.updatedAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
    ];
    const dataOrder = (data) => [
        {
            itemKey: "Tên khách hàng",
            itemValue: data?.user ? data?.user.name : "",
        },
        {
            itemKey: "Trạng thái thanh toán",
            itemValue: checkStatusPayment(data?.status_payment),
        },
        {
            itemKey: "Trạng thái giao hàng",
            itemValue: checkStatusDelivery(data?.status_delivery),
            itemBtn: "Thay đổi",
            onclick: handleUpdateDelivery,
        },
        {
            itemKey: "Tên người nhận",
            itemValue: data?.recipient_name,
        },
        {
            itemKey: "Số điện thoại",
            itemValue: data?.recipient_phone,
        },
        {
            itemKey: "Địa chỉ",
            itemValue: data?.address_delivery,
        },
        {
            itemKey: "Lưu ý",
            itemValue: data?.note,
        },
        {
            itemKey: "Tổng tiền",
            itemValue: formatPrice(data?.total_money),
        },
        {
            itemKey: "Ngày tạo",
            itemValue: new Date(data?.createdAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
    ];
    const dataTransaction = (data) => [
        {
            itemKey: "Tên khách hàng",
            itemValue: data?.user_name,
        },
        {
            itemKey: "Số điện thoại",
            itemValue: data?.user_phone,
        },
        {
            itemKey: "Email",
            itemValue: data?.user_email,
        },
        {
            itemKey: "Phương thức thanh toán",
            itemValue: checkPaymentMethod(data?.payment_method),
        },
        {
            itemKey: "Trạng thái thanh toán",
            itemValue: checkPaymentMethod(data?.status_payment),
        },
        {
            itemKey: "Tổng tiền",
            itemValue: formatPrice(data?.amount),
        },
        {
            itemKey: "Ngày tạo",
            itemValue: new Date(data?.createdAt).toLocaleString("en-US", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
        },
    ];
    useEffect(() => {
        console.log(data);
        if (type === "users") {
            setListItem(dataUser(data));
        } else if (type === "products") {
            setListItem(dataProduct(data));
        } else if (type === "categories") {
            setListItem(dataCategory(data));
        } else if (type === "orders") {
            setListItem(dataOrder(data));
        } else if (type === "transactions") {
            setListItem(dataTransaction(data));
        }
    }, [data, state]);
    const handleUpdateDelivery = async () => {
        setIsShow(isShow => !isShow);
    }
    const handleOnchane = async (e) => {
        let status_delivery = e.target.value;
        let _data = {
            id: data?.id,
            status_delivery: status_delivery,
            status_payment: null
        }
        try {
            await updateOrder(user?.data?.accessToken, _data, navigate, axiosJWT);
            navigate(`/admin/orders/info/${encrypt(data?.id)}`, {
                state: data?.id,
            });
            setIsShow(false);
        } catch (err) {
            console.log(err);
        }


    }

    return (
        <div className="info">
            <Link
                to={`/admin/${type}/edit/${id}`}
                onClick={(e) => (type === "orders" ? e.preventDefault() : "")}
            >
                <div
                    style={{cursor: type === "orders" ? "not-allowed" : "pointer"}}
                    className="editButton"
                >
                    Cập nhật thông tin
                </div>
            </Link>
            <h1 className="title">Thông tin chi tiết</h1>
            <div className="item">
                {type === "users" || type === "products" ? (
                    <img
                        src={
                            type === "users"
                                ? "/images/user-icon.png"
                                : `${BASE_URL}uploads/${image ? image.image_url : ""}`
                        }
                        alt=""
                        className="itemImg"
                    />
                ) : null
                }

                <div className="details">
                    {listItem.map((item, index) => (
                        <div className="detailItem" key={index}>
                            <span className="itemKey">{item.itemKey}:</span>
                            <span className="itemValue">{item.itemValue}</span>
                            {item.itemBtn && (
                                <span className={"itemBtn"}>
                                    <span onClick={item?.onclick}>
                                         {item?.itemBtn}
                                    </span>
                                    {isShow && (
                                        <div className={"change_delivery"}>
                                            <div className={"change_delivery_item"} onChange={handleOnchane}>
                                                <input type="radio" value={0}
                                                       name={"delivery"}
                                                       checked={data?.status_delivery === 0}
                                                       id={"option1"}/>
                                                <label htmlFor={"option1"}>Chưa giao hàng</label>
                                            </div>
                                            <div className={"change_delivery_item"} onChange={handleOnchane}>
                                                <input type="radio" value={1}
                                                       checked={data?.status_delivery === 1}
                                                       name={"delivery"}
                                                       id={"option2"}/>
                                                <label htmlFor={"option2"}>Đang giao hàng</label>
                                            </div>
                                        </div>
                                    )}
                                </span>)}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Info;
