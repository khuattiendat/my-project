import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {formatDate, formatPrice} from "../../utils/format";
import {getCategoryById} from "../../apis/category";
import {useEffect, useState} from "react";
import {checkPaymentMethod, checkStatusPayment} from "../../utils/checkStatus";

const List = (props) => {
    const {data, type} = props;

    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    return (
        <TableContainer component={Paper} className="table">
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow className="tableRow">
                        <TableCell className="tableCell">ID</TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Số Điện Thoại" : "Tên sản phẩm"}
                        </TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Tên khách hàng" : "Ảnh sản phẩm"}
                        </TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Ngày giao dịch" : "Giá"}
                        </TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Tổng tiền" : "Số lượng"}
                        </TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Phương thức thanh toán" : "Giá gốc"}
                        </TableCell>
                        <TableCell className="tableCell">
                            {type === "users" ? "Trạng thái" : "Thành tiền"}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        <>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="tableCell">{row.id}</TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users" ? row.user_phone : row.product.name}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users" ? (
                                            row.user_name
                                        ) : (
                                            <img
                                                src={BASE_URL_SERVER + "/uploads/" + row.product.image}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users"
                                            ? formatDate(row.createdAt)
                                            : formatPrice(row.price)}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users" ? formatPrice(row.amount) : row.quantity}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users"
                                            ? checkPaymentMethod(row.payment_method)
                                            : formatPrice(row.product.price)}
                                    </TableCell>
                                    <TableCell className="tableCell">
                                        {type === "users"
                                            ? checkStatusPayment(row.status_payment)
                                            : formatPrice(row.total_money)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        <div className="no-row">
                            <p>No rows</p>
                        </div>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default List;
