import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Widget = (props) => {
  const { type, total, isFetching } = props;
  let data;
  switch (type) {
    case "user":
      data = {
        title: "Tài khoản",
        link: "Xem tất cả các tài khoản",
        to: "/admin/users",
        total: total.totalUser,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              fontSize: "28px"
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "đơn hàng",
        link: "Xem tất cả các đơn hàng",
        to: "/admin/orders",
        total: total.totalOrder,
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "transaction":
      data = {
        title: "giao dịch",
        link: "Xem tất cả các giao dịch",
        to: "/admin/transactions",
        total: total.totalTransaction,
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "product":
      data = {
        title: "Sản phẩm",
        link: "Xem tất cả các sản phẩm",
        to: "/admin/products",
        total: total.totalProduct,
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        {isFetching ? (
          <img className="image" src="/images/spin.gif" alt="" />
        ) : (
          <span className="counter">{data.total}</span>
        )}
        <Link to={data.to} className="link">
          {data.link}
        </Link>
      </div>
      <div className="right">
        <div className="percentage positive"></div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
