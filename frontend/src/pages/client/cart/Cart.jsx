import Header from "../../../components/header/Header";
import "./cart.scss"
import Footer from "../../../components/footer/Footer";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import {formatPrice} from "../../../utils/format";
import {encrypt} from "../../../utils/crypto";
import {enqueueSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {getProduct} from "../../../redux/productSlice";
import LoginModal from "../../../components/modals/loginModal/LoginModal";
import useModal from "../../../hooks/useModal";
import {getAllProducts} from "../../../apis/products";

const Cart = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    let getProductByLocalStore = useSelector((state) => state.product.product?.listProduct);
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    const [totalMoney, setTotalMoney] = useState(0);
    const [isLogin, setLogin] = useState(false)
    const {isShowing, toggle} = useModal();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        setTotalMoney(getProductByLocalStore.reduce((total, item) => total + item.total_money, 0))
    }, [getProductByLocalStore]);
    useEffect(async () => {

        document.title = "Giỏ hàng"
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        let data = await getAllProducts()
        data.products.forEach((item) => {
            getProductByLocalStore = getProductByLocalStore.map((item2) => {
                if (item.id === item2.product_id) {
                    let quantity = item2.quantity
                    let newTotalMoney = item2.total_money
                    if (quantity > item.quantity) {
                        quantity = item.quantity
                        newTotalMoney = quantity * item.price
                    }
                    let newInventory = item.quantity
                    return {...item2, inventory: newInventory, quantity: quantity, total_money: newTotalMoney}
                }
                return item2
            })
            dispatch(getProduct(getProductByLocalStore))
        })
    }, [])
    const handleRemoveAllProduct = () => {
        dispatch(getProduct([]))
        enqueueSnackbar("Đã xóa hết sản phẩm trong giỏ hàng", {variant: "success", autoHideDuration: 500})
    }
    const handleDeleteItemProduct = (id) => {
        getProductByLocalStore = getProductByLocalStore.filter((item) => item.product_id !== id)
        dispatch(getProduct(getProductByLocalStore))
        enqueueSnackbar("Đã xóa sản phẩm khỏi giỏ hàng", {variant: "success"})
    }
    const handleIncreaseQuantity = (id) => {
        getProductByLocalStore = getProductByLocalStore.map(item => {
            if (item.product_id === id) {
                let newQuantity = item.quantity + 1
                if (newQuantity > item.inventory) {
                    enqueueSnackbar("Số lượng sản phẩm trong kho không đủ", {variant: "error", autoHideDuration: 1000})
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
    const handleClickPayment = () => {
        if (getProductByLocalStore.length > 0) {
            const checkProductQuantity = getProductByLocalStore.some(item => item.inventory <= item.quantity);
            const checkProductQuantity2 = getProductByLocalStore.some(item => item.quantity <= 0);
            if (checkProductQuantity2) {
                enqueueSnackbar("Số lượng sản phẩm phải lớn hơn 0", {variant: "error"})
                return
            }
            if (checkProductQuantity) {
                enqueueSnackbar("Số lượng sản phẩm trong kho không đủ", {variant: "error"})
                return
            }
            if (!user) {
                enqueueSnackbar("Bạn cần đăng nhập để thanh toán", {variant: "error"})
                setLogin(true)
                toggle()
                return
            }
            navigate("/payment")
        } else {
            enqueueSnackbar("Chưa có sản phẩm trong giỏ hàng", {variant: "error"})
        }
    }
    const handleUpdateQuantity = (e, id) => {
        getProductByLocalStore = getProductByLocalStore.map(item => {
            if (item.product_id === id) {
                let newQuantity = e.target.value
                // if (newQuantity < 1) {
                //     enqueueSnackbar("Số lượng sản phẩm phải lớn hơn 0", {variant: "error"})
                //     newQuantity = 1
                // }
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
    return (
        <>
            <Header/>
            <div className={"cart-container"}>
                <h1>
                    Giỏ hàng
                </h1>
                <table>
                    <tbody>
                    <tr>
                        <th colSpan={8}>Thông tin chi tiết sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Tồn kho</th>
                        <th>Tổng giá</th>
                    </tr>

                    {getProductByLocalStore && getProductByLocalStore.length > 0 ? (
                        getProductByLocalStore.map((item, index) => {

                            return (
                                <tr key={index}>
                                    <td colSpan={8}>
                                        <div className={"box-image"}>
                                            <img src={`${BASE_URL_SERVER}/uploads/${item.image}`} alt={item.name}/>
                                            <div className={"name"}>
                                                <Link to={`/product/${encrypt(item.product_id)}`}>
                                                    <span>{item.name}
                                                        {item.inventory <= 0 && (
                                                            <span style={{color: "red", paddingLeft: "0"}}> (SP tạm hết hàng)</span>
                                                        )}
                                                    < /span>
                                                </Link>

                                                <span>
                                                            <DeleteIcon
                                                                onClick={() => handleDeleteItemProduct(item.product_id)}
                                                                style={{color: "red", cursor: "pointer"}}/>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {formatPrice(item.price)}
                                    </td>
                                    <td>
                                        <div className={"quantity"}>
                                            <input type="button" value={"-"} className={"minus"}
                                                   onClick={() => handleDecreaseQuantity(item.product_id)}
                                            />
                                            <input type="number" value={item.quantity}
                                                   min={0}
                                                   max={item.inventory}
                                                   onChange={(e) => handleUpdateQuantity(e, item.product_id)}
                                                   inputMode={"numeric"}/>
                                            <input type="button" value={'+'} className={"plus"}
                                                   onClick={() => handleIncreaseQuantity(item.product_id)}/>

                                        </div>
                                    </td>
                                    <td>
                                        {item.inventory} SP
                                    </td>
                                    <td>
                                        {formatPrice(item.total_money)}
                                    </td>
                                </tr>

                            )
                        })
                    ) : (
                        <tr>
                            <td style={{padding: "20px"}}>Chưa có sản phẩm trong giỏ hàng</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div className={"cart-footer"}>
                    <div className={"left"}>
                        <button onClick={handleRemoveAllProduct} className={"btn btn-delete"}>
                            Xóa tất cả
                        </button>
                    </div>

                    <div className={"right"}>
                        <h2>
                            Tổng Tiền: {formatPrice(totalMoney)}
                        </h2>
                        <div className={"action"}>
                            <Link to={"/"}>
                                <button className={"btn"}>Tiếp tục mua hàng</button>
                            </Link>

                            <button className={"btn btn-payment"} onClick={handleClickPayment}>Thanh Toán
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {
                isLogin && <LoginModal show={isShowing} hide={toggle}/>
            }
            <Footer/>
        </>
    )
}
export default Cart