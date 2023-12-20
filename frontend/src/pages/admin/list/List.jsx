import "./list.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Datatable from "../../../components/datatable/Datatable";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import Loading from "../../../components/Loading/Loading";
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
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const fetchApi = async (valueSearch, page) => {
        try {
            let data = [];
            let totalPage = 1;
            let res;
            switch (type) {
                case "users":
                    setIsFetching(true);
                    res = await getAllUsers(
                        user?.data.accessToken,
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
                        user?.data.accessToken,
                        page,
                        valueSearch,
                        axiosJWT
                    );
                    data = res.orders;
                    totalPage = res.totalPage;
                    break;
                case "transactions":
                    setIsFetching(true);
                    res = await getAllTransaction(
                        user?.data.accessToken,
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
                default:
                    setIsFetching(false);
                    break;
            }
            setData(data);
            setTotalPage(totalPage);
            setIsFetching(false);
        } catch (err) {
            console.log(err);
        }

    };
    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
        }
        setValueSearch("");
        setPage(1);
        const getdata = async () => {
            await fetchApi("", 1);
        };
        getdata();
    }, [type]);
    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
        }
        const getdata = async () => {
            await fetchApi(valueSearch, page);
        };
        getdata();
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
                        user?.data.accessToken,
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
                        user?.data.accessToken,
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
                        user?.data.accessToken,
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
                    await deleteUser(user?.data.accessToken, ids, axiosJWT);
                    enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
                    navigate("/admin/users", {
                        state: ids,
                    });
                } catch (err) {
                    enqueueSnackbar("Xóa thất bại", {variant: "success", autoHideDuration: 1000})
                    console.log(err);
                }
            } else if (type === "products") {
                await deleteProduct(user?.data.accessToken, ids, navigate, axiosJWT);
            } else if (type === "orders") {
                await deleteOrder(user?.data.accessToken, ids, navigate, axiosJWT);
            } else if (type === "categories") {
                await deleteCategory(user?.data.accessToken, ids, navigate, axiosJWT);
            }
        }
    };
    return (
        <div className="list">
            <Sidebar/>
            <div className="listContainer">
                <Navbar/>
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
                {isFetching ? (
                    <Loading/>
                ) : (
                    <Datatable
                        data={data}
                        title={title}
                        type={type}
                        totalPage={totalPage}
                        setPage={setPage}
                        page={page}
                        setIds={setIds}
                    />
                )}
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
    );
};

export default List;
