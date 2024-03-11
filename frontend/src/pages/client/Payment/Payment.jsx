import React, {useEffect, useState} from 'react'
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";
import DeleteIcon from '@mui/icons-material/Delete';
import "./payment.scss"
import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {getProduct} from "../../../redux/productSlice";
import {useDispatch, useSelector} from "react-redux";
import {formatPrice} from "../../../utils/format";
import useModal from "../../../hooks/useModal";
import LoginModal from "../../../components/modals/loginModal/LoginModal";
import {Link, useNavigate} from "react-router-dom";
import {encrypt} from "../../../utils/crypto";
import {addPaymentByPaypal, addPaymentByCash} from "../../../apis/payments";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess, logoutSuccess} from "../../../redux/authSlice";
import {checkPhone} from "../../../utils/validator";
import {showAlertConfirm} from "../../../utils/showAlert";
import Loading from "../../../components/Loading/Loading";
import {getDistricts, getProvinces, getWards} from "../../../apis/provinces";

const Payment = () => {
    let getProductByLocalStore = useSelector((state) => state.product.product?.listProduct);
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [isLogin, setLogin] = useState(false)
    const {isShowing, toggle} = useModal();
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [rate, setRate] = useState("")
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState({});
    const [totalMoney, setTotalMoney] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    //
    const [recipientName, setRecipientName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(0);

    const fetchApi = async () => {
        try {
            const province = await getProvinces();
            console.log(province)
            const rate = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=b199b4389d9a4ae0bc4b751d7fe3ae3b`)
            setRate(rate?.data.rates.VND)
            setProvinces(province);
        } catch (error) {
            console.log("Failed to fetch provinces: ", error);
        }
    }
    useEffect(async () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        document.title = "Thanh toán";
        await fetchApi();
    }, []);
    useEffect(() => {
        setTotalMoney(getProductByLocalStore.reduce((total, item) => total + item.total_money, 0))

    }, [getProductByLocalStore]);
    const handleClickPayment = async () => {
        console.log(selectedProvince)
        if (!getProductByLocalStore.length) {
            enqueueSnackbar("Chưa có sản phẩm trong giỏ hàng", {variant: "error"})
            return
        }
        if (checkPhone(phoneNumber)) {
            enqueueSnackbar("Số điện thoại không hợp lệ", {variant: "error"})
            return
        }
        if (!recipientName || !address) {
            enqueueSnackbar("Vui lòng nhập đầy đủ thông tin", {variant: "error"})
            return
        }
        const checkProductQuantity = getProductByLocalStore.some(item => item.inventory <= 0);
        if (checkProductQuantity) {
            enqueueSnackbar("Số lượng sản phẩm trong kho không đủ", {variant: "error"})
            return
        }
        let addressDelivery = `${address}, ${selectedProvince.ward}, ${selectedProvince.district}, ${selectedProvince.province}`
        let data = {
            user_id: user?.data.user.id,
            user_name: user?.data.user.name,
            user_email: user?.data.user.email,
            user_phone: user?.data.user.phone_number,
            note: note === "" ? "Không có ghi chú" : note,
            recipient_phone: phoneNumber,
            rate,
            address_delivery: addressDelivery,
            recipient_name: recipientName,
            total_money: totalMoney,
            payment_method: paymentMethod,
            listProducts: getProductByLocalStore,
        }
        if (getProductByLocalStore.length > 0) {
            if (!user) {
                enqueueSnackbar("Bạn cần đăng nhập để thanh toán", {variant: "error"})
                setLogin(true)
                toggle()
                return
            }
            let accessToken = user?.data.accessToken
            if (!accessToken) {
                enqueueSnackbar("Đã có lỗi xảy ra vui lòng đăng nhập lại để thanh toán", {variant: "error"})
                dispatch(logoutSuccess())
                setLogin(true)
                toggle()
                return
            }
            let confirm = await showAlertConfirm("Bạn có chắc chắn muốn đặt hàng không?", "Đặt hàng")

            if (confirm) {
                if (paymentMethod === 0) {
                    try {
                        setLogin(true)
                        await addPaymentByCash(accessToken, data, axiosJWT)
                        enqueueSnackbar("Đặt hàng thành công", {variant: "success"})
                        dispatch(getProduct([]));
                        navigate("/users/order")
                        setLogin(false)
                    } catch (error) {
                        enqueueSnackbar("Đã có lỗi xảy ra", {variant: "error", autoHideDuration: 1000})
                        console.log(error)
                        setLogin(false)
                    }
                } else {
                    try {
                        setLogin(true)
                        let response = await addPaymentByPaypal(accessToken, data, axiosJWT)
                        window.location = response.forwardLink
                        dispatch(getProduct([]));
                        setLogin(false)
                    } catch (error) {
                        setLogin(false)
                        enqueueSnackbar("Đã có lỗi xảy ra", {variant: "error", autoHideDuration: 1000})
                        console.log(error)
                    }
                }
            }

        }
    }
    const handleUpdateProvince = async (e) => {
        let provinceId = e.target.value;
        let index = e.nativeEvent.target.selectedIndex;
        let text = e.nativeEvent.target[index].text;
        let district = await getDistricts(provinceId);
        setDistricts(district);
        if (text) {
            setSelectedProvince({province: text})
        }

    }
    const handleUpdateDistricts = async (e) => {
        let districtId = e.target.value;
        let index = e.nativeEvent.target.selectedIndex;
        let text = e.nativeEvent.target[index].text;
        let ward = await getWards(districtId);
        setWards(ward);
        if (text) {
            setSelectedProvince({...selectedProvince, district: text})
        }
    }
    const handleUpdateWards = (e) => {
        let index = e.nativeEvent.target.selectedIndex;
        let text = e.nativeEvent.target[index].text;
        if (text) {
            setSelectedProvince({...selectedProvince, ward: text})
        }
    }
    const handleIncreaseQuantity = (id) => {
        getProductByLocalStore = getProductByLocalStore.map(item => {
            if (item.product_id === id) {
                let newQuantity = item.quantity + 1
                if (newQuantity > item.inventory) {
                    enqueueSnackbar("Số lượng sản phẩm trong kho không đủ", {
                        variant: "error",
                        autoHideDuration: 1000
                    })
                    newQuantity = item.inventory
                }
                let newTotalMoney = newQuantity * item.price
                return {...item, quantity: newQuantity, total_money: newTotalMoney}
            }
            return item
        })
        dispatch(getProduct(getProductByLocalStore))
    }
    const handleDecreaseQuantity = (id) => {
        getProductByLocalStore = getProductByLocalStore.map(item => {
            if (item.product_id === id) {
                let newQuantity = item.quantity - 1
                if (newQuantity < 1) {
                    enqueueSnackbar("Số lượng sản phẩm phải lớn hơn 0", {variant: "error", autoHideDuration: 1000})
                    newQuantity = 1
                }
                let newTotalMoney = newQuantity * item.price
                return {...item, quantity: newQuantity, total_money: newTotalMoney}
            }
            return item
        })
        dispatch(getProduct(getProductByLocalStore))
    }
    const handleUpdateQuantity = (e, id) => {
        getProductByLocalStore = getProductByLocalStore.map(item => {
            if (item.product_id === id) {
                let newQuantity = e.target.value
                if (newQuantity <= 0) {
                    enqueueSnackbar("Số lượng sản phẩm phải lớn hơn 0", {variant: "error"})
                    newQuantity = 1
                }
                if (newQuantity > item.inventory) {
                    enqueueSnackbar("Số lượng sản phẩm trong kho không đủ", {variant: "error"})
                    newQuantity = item.inventory
                }
                let newTotalMoney = newQuantity * item.price
                return {...item, quantity: newQuantity, total_money: newTotalMoney}
            }
            return item
        })
        dispatch(getProduct(getProductByLocalStore))
    }
    const handleDeleteItemProduct = (id) => {
        getProductByLocalStore = getProductByLocalStore.filter((item) => item.product_id !== id)
        dispatch(getProduct(getProductByLocalStore))
        enqueueSnackbar("Đã xóa sản phẩm khỏi giỏ hàng", {variant: "success"})
    }
    return (
        <div className={"payment-container"}>
            <Header/>
            <div className={"payment-content"}>
                {loading ? <Loading/> : (
                    <>
                        <div className={"left"}>
                            <div className={"left_header"}>
                                <h3>
                                    THÔNG TIN ĐẶT HÀNG
                                </h3>
                                <span>
                            Mọi thông tin của bạn sẽ được MONA bảo mật tuyệt đối
                        </span>
                            </div>
                            <div className={"left_content"}>
                                <h3>
                                    THÔNG TIN KHÁCH HÀNG
                                </h3>
                                <div className={"left_info"}>
                                    <div className={"left_info-input"}>
                                        <label htmlFor="name">Họ tên <span style={{color: "red"}}>*</span></label>
                                        <input type="text" id={"name"}
                                               required
                                               value={recipientName}
                                               onChange={(e) => setRecipientName(e.target.value)}
                                               placeholder={"Nhập họ tên ..."}/>
                                    </div>
                                    <div className={"left_info-input"}>
                                        <label htmlFor="phone">Số điện thoại <span
                                            style={{color: "red"}}>*</span></label>
                                        <input type="text" id={"phone"}
                                               required
                                               value={phoneNumber}
                                               onChange={(e) => setPhoneNumber(e.target.value)}
                                               placeholder={"Nhập số điện thoại ..."}/>
                                    </div>
                                    <div className={"left_info-input"}>
                                        <label htmlFor="email">Email</label>
                                        <input type="text" id={"email"} placeholder={"Nhập Email ..."}/>
                                    </div>
                                </div>
                                <div className={"left_address"}>
                                    <div className={"left_address-input"}>
                                        <label htmlFor="provice">Tỉnh/Thành phố <span
                                            style={{color: "red"}}>*</span></label>
                                        <select id={"provice"} onChange={handleUpdateProvince}>
                                            <option label="------ Chọn ------"/>
                                            {provinces &&
                                                provinces.map((item) => (
                                                    <option
                                                        key={item.code}
                                                        id={item.ProvinceID}
                                                        value={item.ProvinceID}
                                                        label={item.ProvinceName}
                                                        name={item.ProvinceName}
                                                    >{item?.ProvinceName}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className={"left_address-input"}>
                                        <label htmlFor="districts">Quận/Huyện <span
                                            style={{color: "red"}}>*</span></label>
                                        <select id={"districts"} onChange={handleUpdateDistricts}>
                                            <option label="------ Chọn ------"/>
                                            {districts &&
                                                districts.map((item) => (
                                                    <option
                                                        key={item.code}
                                                        value={item.DistrictID}
                                                        label={item.DistrictName}
                                                    >{item.DistrictName}</option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className={"left_address-input"}>
                                        <label htmlFor="wards">Phường/xã <span style={{color: "red"}}>*</span></label>
                                        <select onChange={handleUpdateWards}>
                                            <option id={"wards"} label="------ Chọn ------"/>
                                            {wards &&
                                                wards.map((item) => (
                                                    <option
                                                        key={item.code}
                                                        value={item.DistrictID}
                                                        label={item.WardName}
                                                    >{item.WardName}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={"left_info-input"}>
                                    <label htmlFor="address">Địa chỉ <span style={{color: "red"}}>*</span></label>
                                    <input type="text" id={"address"} required
                                           onChange={(e) => setAddress(e.target.value)}
                                           placeholder={"Số nhà, tên đường ..."}/>
                                </div>
                                <div className={"left_info-input"} style={{marginBottom: "30px"}}>
                                    <label htmlFor="note" style={{fontWeight: "bold", fontSize: "18px"}}>Ghi chú đơn
                                        hàng</label>
                                    <textarea onChange={(e) => setNote(e.target.value)}
                                              name="" id="note"
                                              cols="30"
                                              rows="4"></textarea>
                                </div>
                                <h3>
                                    PHƯƠNG THỨC THANH TOÁN <span style={{color: "red"}}>*</span>
                                </h3>
                                <div className={"left_payment"}>
                                    <div className={"left_payment-input"}
                                         onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <input type="radio"
                                               name={"payment"}
                                               id={"payment1"}
                                               value={0}
                                               defaultChecked={Number(paymentMethod) === 0}
                                        />
                                        <label htmlFor="payment1">Thanh toán khi nhận hàng (COD)</label>
                                    </div>
                                    <div className={"left_payment-input"}
                                         onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <input type="radio"
                                               name={"payment"}
                                               id={"payment2"}
                                               value={1}
                                               defaultChecked={Number(paymentMethod) === 1}
                                        />
                                        <label htmlFor="payment2">Thanh toán qua PayPal
                                            <img src="/images/paypal.png" alt=""/>
                                        </label>
                                    </div>
                                </div>
                                <div className={"payment"}>
                                    <button onClick={handleClickPayment}>Đặt Hàng</button>
                                </div>
                            </div>
                        </div>
                        <div className={"right"}>
                            <h3>THÔNG TIN ĐƠN HÀNG</h3>
                            <div className={"right_container"}>
                                {
                                    getProductByLocalStore && getProductByLocalStore.map((item, index) => (
                                        <div className={"right_product"} key={index}>
                                            <div className={"right_product_image"}>
                                                <span>{item.quantity}</span>
                                                <img
                                                    src={`${BASE_URL_SERVER} / uploads /${item.image}` ?? "/images/no-image.jfif"}
                                                    alt={item.name}/>
                                            </div>
                                            <div className={"right_product_name"}>
                                                <Link to={` / product /${encrypt(item.product_id)}`}>
                                                    <span>{item.name}</span>
                                                </Link>

                                                <div className={"quantity"}>
                                                    <input type="button" value={"-"} className={"minus"}
                                                           onClick={() => handleDecreaseQuantity(item.product_id)}
                                                    />
                                                    <input type="number" value={item.quantity}
                                                           min={1}
                                                           max={item.quantity}
                                                           onChange={(e) => handleUpdateQuantity(e, item.product_id)}
                                                           inputMode={"numeric"}/>
                                                    <input type="button" value={'+'} className={"plus"}
                                                           onClick={() => handleIncreaseQuantity(item.product_id)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={"right_product_total"}>
                                                <span>{formatPrice(item.total_money)}</span>
                                                <DeleteIcon onClick={() => handleDeleteItemProduct(item.product_id)}
                                                            style={{color: "red", cursor: "pointer"}}/>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className={"right_total"}>
                                <span>Tổng tiền: </span>
                                <span>{formatPrice(totalMoney)}</span>
                            </div>

                        </div>
                    </>
                )}
            </div>
            <div className={"right_guarantee"}>
                <div className={"right_guarantee-item"}>
                    <img src="/images/chung_nhan_icon.png" alt=""/>
                    <span>Đủ chứng nhận chất lượng</span>
                </div>
                <div className={"right_guarantee-item"}>
                    <img src="/images/chat_luong_icon.png" alt=""/>
                    <span>Đúng trọng lượng và hàm lượng</span>
                </div>
                <div className={"right_guarantee-item"}>
                    <img src="/images/thu_doi_cao_icon.png" alt=""/>
                    <span>Thua mua đổi trọn đời</span>
                </div>
                <div className={"right_guarantee-item"}>
                    <img src="/images/bao_hanh_vuot_troi_icon.png" alt=""/>
                    <span>Làm sạch trọn đời</span>
                </div>
            </div>
            {isLogin && <LoginModal show={isShowing} hide={toggle}/>}
            <Footer/>
        </div>
    )
}
export default Payment