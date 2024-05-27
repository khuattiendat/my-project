import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {formatPrice} from "../../utils/format";
import {useEffect, useState} from "react";

const Featured = (data) => {
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        if (data?.data?.total) {
            setPercent(data?.data?.total / 1000000);
        }
    }, [data])
    return (
        <div className="featured">
            <div className="top">
                <h1 className="title">Tổng doanh thu</h1>
                <MoreVertIcon fontSize="small"/>
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={percent} text={`${parseFloat(percent.toString()).toFixed(2)}%`} strokeWidth={5}/>
                </div>
                <p className="title">Tổng doanh thu trong ngày</p>
                <p className="amount">{formatPrice(data?.data?.total)}</p>
                <p className="desc">
                    Xử lý giao dịch trước đó. Các khoản thanh toán cuối cùng có thể không được bao gồm.
                </p>
            </div>
        </div>
    );
};

export default Featured;
