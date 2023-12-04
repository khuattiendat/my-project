import "./datatable.scss";
import {DataGrid} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CryptoJS from "crypto-js";
import {
    userColumns,
    productColumns,
    orderColumns,
    transactionColumns,
    categoryColumn,
} from "../../datatablesource";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {deleteUser} from "../../apis/users";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../../utils/createInstance";
import {loginSuccess} from "../../redux/authSlice";
import {showAlertConfirm, showAlertWarning} from "../../utils/showAlert";
import {deleteProduct} from "../../apis/products";
import {deleteOrder} from "../../apis/orders";
import {deleteCategory} from "../../apis/category";
import {formatPrice} from "../../utils/format";
import {encrypt} from "../../utils/crypto";
import {checkPaymentMethod, checkStatusDelivery, checkStatusPayment} from "../../utils/checkStatus";
import {enqueueSnackbar} from "notistack";

const Datatable = (props) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const userId = user?.data.user.id;
    const {data, type, setIds} = props;
    const [rows, setRows] = useState(data);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const actionColumn = [
        {
            field: "action",
            headerName: "Hành động",
            width: 150,
            renderCell: (params) => {
                const id = encrypt(params.id.toString());
                return (
                    <div className="cellAction">
                        <Link
                            to={`/admin/${type}/info/${id}`}
                            style={{textDecoration: "none"}}
                        >
                            <div className="viewButton">Chi tiết</div>
                        </Link>
                        <button
                            disabled={type === "transactions" ? true : false}
                            className={
                                type === "transactions"
                                    ? "deleteButton disabled"
                                    : "deleteButton"
                            }
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        if (type === "users") {
            setColumns(userColumns.concat(actionColumn));
        }
        if (type === "products") {
            rows.map((row, i) => {
                row.price = formatPrice(row.price);
            });
            setColumns(productColumns.concat(actionColumn));
        }
        if (type === "orders") {
            rows.map((row, i) => {
                row.total_money = formatPrice(row.total_money);
                row.status_payment = checkStatusPayment(row.status_payment)
                row.status_delivery = checkStatusDelivery(row.status_delivery)
            });
            setColumns(orderColumns.concat(actionColumn));
        }
        if (type === "transactions") {
            rows.map((row, i) => {
                row.amount = formatPrice(row.amount);
                row.status_payment = checkStatusPayment(row.status_payment)
                row.payment_method = checkPaymentMethod(row.payment_method)
            });
            setColumns(transactionColumns.concat(actionColumn));
        }
        if (type === "categories") {
            setColumns(categoryColumn.concat(actionColumn));
        }
        console.log(rows)
    }, []);

    const handleDelete = async (id) => {
        if (type === "users" && id === userId) {
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
                    await deleteUser(user?.data.accessToken, id, axiosJWT);
                    enqueueSnackbar("Xóa thành công", {variant: "success", autoHideDuration: 1000})
                    navigate("/admin/users", {
                        state: id,
                    });
                } catch (err) {
                    enqueueSnackbar("Xóa thất bại", {variant: "success", autoHideDuration: 1000})
                    console.log(err)
                }
            } else if (type === "products") {
                deleteProduct(user?.data.accessToken, id, navigate, axiosJWT);
            } else if (type === "orders") {
                deleteOrder(user?.data.accessToken, id, navigate, axiosJWT);
            } else if (type === "categories") {
                deleteCategory(user?.data.accessToken, id, navigate, axiosJWT);
            }
        }
    };
    return (
        <div className="datatable">
            <>
                <DataGrid
                    className="datagrid"
                    rows={rows}
                    columns={columns}
                    pageSize={9}
                    rowsPerPageOptions={[9]}
                    checkboxSelection
                    onSelectionModelChange={(id) => setIds(id)}
                    hideFooter
                />
            </>
        </div>
    );
};

export default Datatable;
