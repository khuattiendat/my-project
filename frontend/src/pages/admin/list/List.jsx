import "./list.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Datatable from "../../../components/datatable/Datatable";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../../../components/Loading/loadingPage/LoadingPage";
import {useEffect, useState} from "react";
import {deleteUser, getAllUsers} from "../../../apis/users";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import {
    deleteProduct,
    getAllProducts,
    getProductByPaging,
    searchProduct,
} from "../../../apis/products";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {deleteOrder, getAllOrder} from "../../../apis/orders";
import {getAllTransaction} from "../../../apis/transactions";
import {
    deleteCategory,
    getAllCategory,
    getAllCategoryByPaging,
} from "../../../apis/category";
import {showAlertConfirm, showAlertWarning} from "../../../utils/showAlert";
import {enqueueSnackbar} from "notistack";
import {deleteBanner, getAllBanner} from "../../../apis/banner";
import {getRevenueYearly, getStatisticalCategoryProduct, getStatisticalInventory} from "../../../apis/statistical";

const List = ({title, type}) => {
    const {state} = useLocation();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?.data.user.id;
    const [ids, setIds] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [valueSearch, setValueSearch] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState([]);
    const [dataStatistical, setDataStatistical] = useState({
        category: [],
        product: [],
        revenue: [],
    });
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    let maxOffset = 10;
    let thisYear = (new Date()).getFullYear();
    let allYears = [];
    for (let x = 0; x <= maxOffset; x++) {
        allYears.push(thisYear - x)
    }
    const accessToken = user?.data?.accessToken || localStorage.getItem("accessToken");
    if (!accessToken) {
        navigate("/admin/login");
    }
    const fetchApi = async (valueSearch, page) => {
        try {
            let data = [];
            let totalPage = 1;
            let res;
            let dataStatistical = {};
            switch (type) {
                case "users":
                    setIsFetching(true);
                    res = await getAllUsers(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    data = res.users;
                    totalPage = res.totalPage;
                    break;
                case "products":
                    setIsFetching(true);
                    res = await getProductByPaging(page, valueSearch);
                    data = res.products;
                    totalPage = res.totalPage;
                    break;
                case "orders":
                    setIsFetching(true);
                    res = await getAllOrder(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    data = res?.orders;
                    totalPage = res?.totalPage;
                    break;
                case "transactions":
                    setIsFetching(true);
                    res = await getAllTransaction(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    data = res.transactions;
                    totalPage = res.totalPage;
                    break;
                case "categories":
                    setIsFetching(true);
                    res = await getAllCategoryByPaging(page);
                    data = res.categories;
                    totalPage = res.totalPage;
                    break;
                case "banners":
                    setIsFetching(true);
                    res = await getAllBanner(page);
                    data = res?.data?.data?.banners;
                    totalPage = res?.data?.data?.totalPage;
                    break;
                case "statistical":
                    setIsFetching(true);
                    let dataCategory = await getStatisticalCategoryProduct(accessToken, axiosJWT)
                    let dataProduct = await getStatisticalInventory(accessToken, axiosJWT)
                    let dataRevenue = await getRevenueYearly(accessToken, axiosJWT, selectedYear)
                    dataStatistical = {
                        category: dataCategory?.data?.data,
                        product: dataProduct?.data?.data,
                        revenue: dataRevenue?.data?.data
                    }
                    totalPage = 1;
                    break;

                default:
                    setIsFetching(false);
                    break;
            }
            setData(data);
            setTotalPage(totalPage);
            type === "statistical" && setDataStatistical(dataStatistical);
            setIsFetching(false);
        } catch (err) {
            console.log(err);
        }

    };
    useEffect(async () => {
        if (!user) {
            navigate("/admin/login");
        }
        setValueSearch("");
        setPage(1);
        await fetchApi("", 1);

    }, [type, selectedYear]);
    useEffect(async () => {
        if (!user) {
            navigate("/admin/login");
        }
        const getdata = async () => {
            await fetchApi(valueSearch, page);
        };
        await getdata();
        console.log(data)
    }, [state, page]);
    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        try {
            let res;
            let dataValue;
            let totalPage;
            switch (type) {
                case "users":
                    setIsFetching(true);
                    res = await getAllUsers(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    dataValue = res.users;
                    totalPage = res.totalPage;
                    break;
                case "products":
                    setIsFetching(true);
                    res = await getProductByPaging(page, valueSearch);
                    dataValue = res.products;
                    totalPage = res.totalPage;
                    break;
                case "categories":
                    setIsFetching(true);
                    res = await getAllCategoryByPaging(page, valueSearch);
                    dataValue = res.categories;
                    totalPage = res.totalPage;
                    break;
                case "orders":
                    setIsFetching(true);
                    res = await getAllOrder(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    dataValue = res.orders;
                    totalPage = res.totalPage;
                    break;
                case "transactions":
                    setIsFetching(true);
                    res = await getAllTransaction(
                        accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    dataValue = res.transactions;
                    totalPage = res.totalPage;
                    break;
                default:
                    setIsFetching(false);
                    break;
            }
            setData(dataValue);
            setTotalPage(totalPage);
            setPage(1);
            setIsFetching(false);
        } catch (err) {
            setIsFetching(false)
            console.log(err);
        }
    };
    const handleDelete = async (ids) => {
        if (type === "users" && ids.includes(userId)) {
            showAlertWarning("Không thể xóa tài khoản đang đang nhập");
            return;
        }
        let confirm = await showAlertConfirm(
            "Bạn có chắc không?",
            "Nếu xóa bạn sẽ xóa mọi thứ liên quan đến nó !!!"
        );
        if (confirm) {
            if (type === "users") {
                try {
                    await deleteUser(accessToken, ids, axiosJWT);
                    enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
                    navigate("/admin/users", {
                        state: ids,
                    });
                } catch (err) {
                    enqueueSnackbar("Xóa thất bại", {variant: "success", autoHideDuration: 1000})
                    console.log(err);
                }
            } else if (type === "products") {
                await deleteProduct(accessToken, ids, navigate, axiosJWT);
            } else if (type === "orders") {
                await deleteOrder(accessToken, ids, navigate, axiosJWT);
            } else if (type === "categories") {
                await deleteCategory(accessToken, ids, navigate, axiosJWT);
            } else if (type === "banners") {
                try {
                    await deleteBanner(accessToken, ids, axiosJWT);
                    enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
                    navigate("/admin/banners", {
                        state: ids,
                    });
                } catch (err) {
                    enqueueSnackbar("Xóa thất bại", {variant: "error", autoHideDuration: 1000})
                    console.log(err)
                }
            }
        }
    };
    return (
        <div className="list">
            <Sidebar/>
            <div className="listContainer">

                <Navbar/>
                <div style={{marginTop: "60px"}}>
                    {type === "statistical" ? (

                            <div className="datatableTitle">
                                <span>Thống kê</span>
                                <div className={"statistical-year"}>
                                    <span>Thống kê doanh thu theo năm</span>
                                    <select onChange={(e) => setSelectedYear(e.target.value)}>
                                        {
                                            allYears.map((year, index) => (
                                                <option key={index} value={year}>{year}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </div>
                        ) :
                        (
                            <>
                                <div className="datatableTitle">
                                    <span>{title}</span>
                                    <div className="input-form">
                                        <form action="" onSubmit={handleSubmitSearch}>
                                            <input
                                                type="text"
                                                placeholder="search"
                                                value={valueSearch}
                                                onChange={(e) => setValueSearch(e.target.value)}
                                            />
                                            <button type="submit">
                                                <SearchIcon/>
                                            </button>
                                        </form>
                                    </div>
                                    <button
                                        disabled={ids.length <= 0 || type === "transactions"}
                                        className={
                                            (ids.length <= 0 || type === "transactions") ? "deleteButton disabled" : "deleteButton"
                                        }
                                        onClick={() => {
                                            handleDelete(ids);
                                        }}
                                    >
                                        Xóa các mục đã chọn
                                    </button>

                                    <Link
                                        onClick={(e) => {
                                            if (type === "orders" || type === "transactions") {
                                                e.preventDefault();
                                            }
                                        }}
                                        to={`/admin/${type}/new`}
                                        className={(type === "transactions" || type === "orders") ? "disabled link" : "link"}>
                                        Thêm Mới
                                    </Link>

                                </div>
                            </>
                        )
                    }


                    {isFetching ? (
                        <div style={{height: "500px"}}>
                            <Loading/>
                        </div>
                    ) : (

                        data && <Datatable
                            dataStatistical={dataStatistical}
                            data={data}
                            title={title}
                            type={type}
                            totalPage={totalPage}
                            setPage={setPage}
                            page={page}
                            setIds={setIds}
                        />

                    )}
                    {
                        (type !== "statistical") && <div className="pagination">
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
                    }
                </div>
            </div>
        </div>
    );
};

export default List;
