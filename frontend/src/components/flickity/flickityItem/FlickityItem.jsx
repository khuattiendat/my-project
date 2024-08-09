import {Link} from "react-router-dom";
import {encrypt} from "../../../utils/crypto";
import {formatPrice, formatPriceDiscount} from "../../../utils/format";
import "./flickityItem.scss"

import 'swiper/css';
import 'swiper/css/pagination';
import Loading from "../../Loading/loadingPage/LoadingPage";

const FlickityItem = ({product, loading}) => {
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    return (
        loading ?
            <Loading/> :
            <div className={"product-box"}>
                {product.discount > 0 &&
                    <div className={"product-discount"}>-{product.discount}%</div>}

                <Link to={`/product/${encrypt(product.id)}`}>
                    <div className={"box-image"}>
                        <img
                            src={BASE_URL_SERVER + "/uploads/" + product.image}
                            alt=""/>
                        <span> Quick view</span>
                    </div>
                </Link>

                <div className={"box-content"}>
                    <Link to={`/product/${encrypt(product.id)}`}>
                        <div className={"product-name"}>
                            {product.name}
                        </div>
                    </Link>
                    <div className={"product-price"}>
                        {product.discount > 0 &&
                            <span className={"cost"}>{formatPrice(product.price)}</span>}
                        <span
                            className={"discount"}>{formatPriceDiscount(product.price, product.discount)}</span>
                    </div>
                    {
                        product.total_sold && (
                            <div className={"total_sold"}>
                                <span className={"sold"}>Đã bán: {product.total_sold}</span>
                            </div>
                        )
                    }

                </div>
            </div>
    )
}
export default FlickityItem;