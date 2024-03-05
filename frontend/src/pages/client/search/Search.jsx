import React, {useEffect, useState} from 'react';
import './search.scss'
import Header from "../../../components/header/Header";
import {useSearchParams} from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import {searchProduct} from "../../../apis/products";
import Flickity from "../../../components/flickity/Flickity";

const Search = () => {
    const [searchParams] = useSearchParams();
    const searchValue = searchParams.get('q');
    const [listProduct, setListProduct] = useState([])
    const [loading, setLoading] = useState(false)
    const [totalProduct, setTotalProduct] = useState(0)
    const getListProduct = async () => {
        setLoading(true)
        let products = await searchProduct(searchValue);
        setListProduct(products.products);
        setTotalProduct(products.totalProduct);
        setLoading(false)
    }
    useEffect(async () => {
        document.title = searchValue ? `Tìm kiếm: ${searchValue}` : "Tìm kiếm";
        if (!searchValue) {
            return;
        }
        await getListProduct();
    }, [searchValue]);
    return (
        <div className={'search'}>
            <Header/>
            <div className="search__content">
                <div className={"search__content-header"}>
                    <h1>Tìm kiếm </h1>
                    <span>Có <span className={'result'}>{totalProduct} sản phẩm</span> cho tìm kiếm</span>
                </div>
                <h2 className={"search__content-text"}>Kết quả tìm kiếm cho: <span>"{searchValue}"</span></h2>
                <div className={"search__content-products"}>
                    {
                        listProduct && <Flickity data={listProduct} loading={loading}/>
                    }
                </div>

            </div>
            <Footer/>
        </div>
    );
}
export default Search;
