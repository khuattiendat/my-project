import Header from "../../../components/header/Header";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {FreeMode, Navigation, Thumbs} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PercentIcon from '@mui/icons-material/Percent';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import "./product.scss"
import {Link, useNavigate, useParams} from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import Flickity from "../../../components/flickity/Flickity";
import {decrypt, encrypt} from "../../../utils/crypto";
import {getListImages, getProductByCategoryId, getProductById} from "../../../apis/products";
import {formatPrice, formatPriceDiscount} from "../../../utils/format";
import {enqueueSnackbar} from "notistack";
import {useDispatch, useSelector} from "react-redux";
import {getProduct} from "../../../redux/productSlice";

const Product = () => {
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    const params = useParams();
    const {id} = params;
    const _id = decrypt(id);
    const navigate = useNavigate()
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1)
    const [listProductByCategoyId, setListProductByCategoyId] = useState([])
    const [listImage, setListImage] = useState([])
    let getProductByLocalStore = useSelector((state) => state.product.product?.listProduct);
    const dispatch = useDispatch();
    const fetchApis = async () => {
        try {
            let product = await getProductById(_id);
            let listProduct = await getProductByCategoryId(product.category_id)
            let listImage = await getListImages(_id)
            setListImage(listImage);
            setProduct(product)
            setListProductByCategoyId(listProduct)
            document.title = product.name ?? "Sản phẩm"
        } catch (e) {
            window.location = "/notFound"
        }

    }
    useEffect(async () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        await fetchApis()

    }, [id]);
    const handleAddCart = () => {
        let price = product.price - (product.price * product.discount / 100)
        let data = {
            product_id: product.id,
            quantity: quantity,
            price: Number(price), // giá đã giảm giá
            total_money: Number(price * quantity),
            name: product.name,
            image: product.image,
            inventory: product.quantity
        }
        if (getProductByLocalStore) {
            const isProductInCart = getProductByLocalStore.some(item => item.product_id === product.id)

            if (isProductInCart) {
                let newState = getProductByLocalStore.map(item => {
                    if (item.product_id === product.id) {
                        let newQuantity = item.quantity + quantity
                        if (newQuantity > item.inventory) {
                            newQuantity = item.inventory
                        }
                        let newTotalMoney = newQuantity * price
                        return {...item, quantity: newQuantity, total_money: newTotalMoney}
                    }
                    return item
                })
                getProductByLocalStore = newState
            } else {
                getProductByLocalStore = [...getProductByLocalStore, data]
            }
            dispatch(getProduct(getProductByLocalStore));
            setQuantity(1)
            navigate("/cart")
            enqueueSnackbar("Thêm sản phẩm vào giỏ hàng thành công", {variant: "success", style: {zIndex: "-1"}})
        }
    }
    return (
        <div className={"product"}>
            <Header/>
            <div className={"product-container"}>
                <div className={"left"}>
                    <div className={"product-discount"}>
                        {product.discount > 0 ? `-${product.discount}%` : "0%"}
                    </div>
                    <>
                        <Swiper
                            style={{
                                '--swiper-navigation-color': '#fff',
                                '--swiper-pagination-color': '#fff',
                            }}
                            loop={true}
                            spaceBetween={10}
                            thumbs={{swiper: thumbsSwiper}}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper2"
                        >
                            {listImage.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img src={`${BASE_URL_SERVER}/uploads/${item.image_url}`} alt={"anh"}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={4}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="mySwiper"
                        >
                            {listImage.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img src={`${BASE_URL_SERVER}/uploads/${item.image_url}`}/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                </div>
                <div className={"right"}>
                    <div className={"breadcrumbs"}>
                        <Link to={"/"}>
                            Trang chủ
                        </Link>
                        /
                        <Link to={`/categories/${encrypt(product.category_id ? product.category_id : "1")}`}>
                            {product.Category ? product?.Category.name : ""}
                        </Link>
                        /
                        <Link to={"#"}>
                            {product.name}
                        </Link>
                    </div>
                    <div className={"product-content"}>
                        <div className={"product-name"}>
                            {product.name}
                        </div>
                        <div className={"line small"}></div>
                        <div className={"price"}>
                            <span style={{color: "rgba(102, 102, 102, 0.85)", marginRight: "4px"}}>
                                Giá sản phẩm:
                            </span>
                            {formatPriceDiscount(product.price, product.discount)}
                        </div>
                        <div className={"category"}>
                                <span style={{color: "rgba(102, 102, 102, 0.85)", marginRight: "4px"}}>
                                Loại sản phẩm:
                            </span>
                            {product.Category ? product?.Category.name : ""}
                        </div>
                        <div className={"cart"}>
                            <div className={"quantity"}>
                                <input type="button" value={"-"} className={"minus"}
                                       onClick={() => setQuantity(quantity <= 1 ? 1 : quantity - 1)} readOnly={true}/>
                                <input type="number" min={1} inputMode={"numeric"} value={quantity < 1 ? 1 : quantity}
                                       onChange={(e) => setQuantity(e.target.value <= 1 ? 1 : parseInt(e.target.value))}/>
                                <input type="button" value={'+'} className={"plus"}
                                       onClick={() => setQuantity(quantity + 1)} readOnly={true}/>
                            </div>
                            <div className={"btn_add"}>
                                <button onClick={handleAddCart}>
                                    <span>
                                    THÊM VÀO GIỎ HÀNG
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className={"line"}></div>
                    </div>
                    <div className={"commitment"}>
                        <div className={"commitment-item"}>
                            <div className={"icon"}>
                                <CurrencyExchangeIcon/>
                            </div>
                            <span>Miễn phí đổi hàng 30 ngày</span>
                        </div>
                        <div className={"commitment-item"}>
                            <EmojiEventsIcon/>
                            <span>Đủ chứng nhận chất lượng</span>
                        </div>
                        <div className={"commitment-item"}>
                            <PercentIcon/>
                            <span>Trả góp 0% lãi suất</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"product-footer"}>
                <div className={"line"}>
                </div>
                <div className={"product-description"}>
                    <span className={"title"}>
                        Mô tả
                    </span>
                    <span className={"content"}>
                         {product.description}
                    </span>

                </div>
                <div className={"line"}></div>
                <div className={"product-similar"}>
                    <div className={"title"}>
                        SẢN PHẨM TƯƠNG TỰ
                    </div>
                    <div className={"product-flickity"}>
                        <Flickity data={listProductByCategoyId}/>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    )

}
export default Product