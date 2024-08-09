import Header from "../../../components/header/Header";
import { filterProduct} from "../../../apis/products";
import "./category.scss"
import Footer from "../../../components/footer/Footer";
import {useEffect, useState} from "react";
import FlickityItem from "../../../components/flickity/flickityItem/FlickityItem";
import {useParams} from "react-router-dom";
import {decrypt} from "../../../utils/crypto";
import {getAllCategory} from "../../../apis/category";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LoadingPage from "../../../components/Loading/loadingPage/LoadingPage";

const dataFilterProductByPrice = [
    {
        id: 6,
        name: "Tất cả"
    },
    {
        id: 1,
        name: "0 - 3 triệu"
    },
    {
        id: 2,
        name: "3 triệu - 5 triệu"
    },
    {
        id: 3,
        name: "5 triệu - 7 triệu"
    },
    {
        id: 4,
        name: "7 triệu - 10 triệu"
    },
    {
        id: 5,
        name: "Trên 10 triệu"
    }
]

const
    Category = () => {
        const params = useParams();
        const {id} = params;
        const _id = decrypt(id);
        const [categories, setCategories] = useState([_id])
        const [price, setPrice] = useState("6")
        const [listProduct, setListProduct] = useState([])
        const [listCategory, setListCategory] = useState([])
        const [sort, setSort] = useState("priceLowToHigh")
        const [page, setPage] = useState(1);
        const [totalPage, setTotalPage] = useState(1);
        const [loading, setLoading] = useState(false);
        const [loadingCategory, setLoadingCategory] = useState(false);
        const fetchProduct = async (price, categories, page) => {
            setLoading(true)
            try {
                let data = await filterProduct(price, sort, categories, page)
                setListProduct(data.products)
                setTotalPage(data.pagination.totalPage)
                setPage(Number(data.pagination.currentPage))
                setLoading(false)
            } catch (e) {
                setLoading(false)
                console.log(e)
            }
        }
        const fetchCategory = async () => {
            try {
                setLoadingCategory(true)
                let listCategory = await getAllCategory();
                setListCategory(listCategory)
                setLoadingCategory(false)
            } catch (e) {
                setLoadingCategory(false)
                console.log(e)
            }
        }
        useEffect(async () => {
            await fetchCategory()
        }, []);
        useEffect(async () => {
            document.title = "Danh mục sản phẩm"
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
            document.querySelectorAll(".checkbox_category").forEach(item => {
                item.checked = (item.value === String(_id))
            })
            await fetchProduct(price, [_id], 1)
        }, [id])
        useEffect(async () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
            await fetchProduct(price, categories, page)
        }, [price, categories, sort, page])

        const handleUpdateCategories = async (e) => {
            if (categories.includes(e.target.value)) {
                setCategories(categories.filter(item => item !== e.target.value))
            } else {
                setCategories([...categories, e.target.value])
            }
        }
        const handleUpdatePrice = (e) => {
            setPrice(e.target.value)
        }
        const handleUpdateSort = (e) => {
            setSort(e.target.value)
        }

        return (
            <div className={"category"}>
                <Header/>
                <div className={"category-container"}>
                    <div className={"left"}>
                        <h2 className={"title"}>Lọc sản phẩm</h2>
                        <div className={"category_product"}>
                            <h3>Danh mục sản phẩm</h3>
                            {
                                loadingCategory ? <LoadingPage/> : (
                                    listCategory.map((item, index) => (
                                        <div className={"category_product-item"} key={index}>
                                            <input type="checkbox"
                                                   className={"checkbox_category"}
                                                   defaultChecked={item.id == _id}
                                                   id={`option-${item.id}`}
                                                   value={item.id}
                                                   onChange={handleUpdateCategories}/>
                                            <label htmlFor={`option-${item.id}`}>{item.name}</label>
                                        </div>
                                    ))
                                )
                            }

                        </div>
                        <div className={"category_product product"}>
                            <h3>Khoảng giá</h3>
                            {dataFilterProductByPrice.map((item, index) => (
                                <div className={"category_product-item"} key={index}>
                                    <input type="checkbox"
                                           id={`option-price-${item.id}`}

                                           value={item.id}
                                           checked={String(item.id) === price}
                                           onChange={handleUpdatePrice}/>
                                    <label htmlFor={`option-price-${item.id}`}>{item.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={"right"}>
                        <div className={"right_header"}>
                            <h2 className={"right_header-title"}>
                                Danh sách sản phẩm
                            </h2>
                            <div className={"right_header-sort"}>
                                <select name="sort" id="sort" onChange={handleUpdateSort}>
                                    <option selected={true} value="priceLowToHigh">Giá thấp đến cao</option>
                                    <option value="priceHighToLow">Giá cao đến thấp</option>
                                    <option value="nameAtoZ">Tên từ A dến Z</option>
                                    <option value="nameZtoA">Tên từ Z đến A</option>
                                </select>
                            </div>
                        </div>
                        {
                            listProduct.length ? (
                                loading ? <LoadingPage/> : (
                                    <div className={"right_list_product"}>
                                        {
                                            listProduct.map((item, index) => (
                                                <FlickityItem product={item} loading={loading} key={index}/>
                                            ))
                                        }
                                    </div>
                                )
                            ) : (
                                <h3 style={{
                                    margin: "40px 0",
                                    textAlign: "center",
                                }}>Không có sản phẩm nào !!!</h3>
                            )
                        }
                        {listProduct.length ? (
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
                        ) : (
                            <></>
                        )}
                    </div>
                </div>

                <Footer/>
            </div>
        )
    }
export default Category