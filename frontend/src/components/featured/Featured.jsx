import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
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
                    <CircularProgressbar value={percent} text={`${percent}%`} strokeWidth={5}/>
                </div>
                <p className="title">Tổng doanh thu trong ngày (100tr)</p>
                <p className="amount">{formatPrice(data?.data?.total)}</p>
                <p className="desc">
                    Xử lý giao dịch trước đó. Các khoản thanh toán cuối cùng có thể không được bao gồm.
                </p>
                {/*<div className="summary">*/}
                {/*    <div className="item">*/}
                {/*        <div className="itemTitle">Target</div>*/}
                {/*        <div className="itemResult negative">*/}
                {/*            <KeyboardArrowDownIcon fontSize="small"/>*/}
                {/*            <div className="resultAmount">$12.4k</div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="item">*/}
                {/*        <div className="itemTitle">Last Week</div>*/}
                {/*        <div className="itemResult positive">*/}
                {/*            <KeyboardArrowUpOutlinedIcon fontSize="small"/>*/}
                {/*            <div className="resultAmount">$12.4k</div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*    <div className="item">*/}
                {/*        <div className="itemTitle">Last Month</div>*/}
                {/*        <div className="itemResult positive">*/}
                {/*            <KeyboardArrowUpOutlinedIcon fontSize="small"/>*/}
                {/*            <div className="resultAmount">$12.4k</div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default Featured;
