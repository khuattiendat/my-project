import React, {useEffect, useState} from "react";
import Header from "../../../components/header/Header";
import Banner from "../../../components/banner/Banner";
import {dataBanner} from "../../../dataBanner";
import "./home.scss"
import Flickity from "../../../components/flickity/Flickity";
import Outstansing from "../../../components/outstanding/Outstansing";
import Footer from "../../../components/footer/Footer";
import {getAllProducts, getBestsellerProducts, getNewest} from "../../../apis/products";
import {fillerProduct} from "../../../utils/fillerProduct";
import {getAllBannerIsActive} from "../../../apis/banner";

const Home = () => {
    const [listBestseller, setListBestseller] = useState([])
    const [listNewest, setListNewest] = useState([])
    const [listProduct, setListProduct] = useState([])
    const [listBanner, setListBanner] = useState([])
    const [loading, setLoading] = useState(false)
    const fetchApis = async () => {
        setLoading(true)
        let listBanner = await getAllBannerIsActive();
        let listBestseller = await getBestsellerProducts();
        let listNewest = await getNewest();
        let listProduct = await getAllProducts();
        setListBanner(listBanner.data.data)
        setListProduct(listProduct.products)
        setListBestseller(listBestseller.products)
        setListNewest(listNewest.products);
        setLoading(false)
    }
    useEffect(async () => {
        document.title = "Home";
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
        await fetchApis();
    }, []);
    return (
        <div className="home">
            <Header/>
            <Banner data={listBanner} loading={loading}/>
            <div className={"home-container"}>
                <h1 className={"title-h1"}>
                    <p></p>
                    <span>SẢN PHẨM BÁN CHẠY</span>
                    <p></p>
                </h1>
                <Flickity data={listBestseller} loading={loading}/>
                <h1 className={"title-h1"}>
                    <p></p>
                    <span>sản phẩm mới</span>
                    <p></p>
                </h1>
                <Flickity data={listNewest} loading={loading}/>
                <h1 className={"title-h1"}>
                    <p></p>
                    <span>Nhẫn</span>
                    <p></p>
                </h1>
                <Flickity data={fillerProduct(listProduct, "Nhẫn")} loading={loading}/>
                <h1 className={"title-h1"}>
                    <p></p>
                    <span>Hoa tai</span>
                    <p></p>
                </h1>
                <Flickity data={fillerProduct(listProduct, "Hoa tai")} loading={loading}/>
                <h1 className={"title-h1"}>
                    <p></p>
                    <span>Giá trị nổi bật</span>
                    <p></p>
                </h1>
            </div>

            <Outstansing/>
            <Footer/>
        </div>
    );
};

export default Home;
