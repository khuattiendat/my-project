import "./flickity.scss"
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {Swiper, SwiperSlide} from 'swiper/react';
import {formatPrice, formatPriceDiscount} from "../../utils/format";
import {Link} from "react-router-dom";
import {encrypt} from "../../utils/crypto";
import FlickityItem from "./flickityItem/FlickityItem";
import Loading from "../Loading/loadingPage/LoadingPage";


const Flickity = ({data, loading}) => {
    return (
        <>
            {loading ? <Loading/> :
                <>
                    <div className={"flickity"}>
                        <Swiper
                            loop={data.length > 5}
                            slidesPerView={4}
                            spaceBetween={10}
                            // autoplay={{
                            //     delay: 3000,
                            //     disableOnInteraction: false,
                            // }}
                            // modules={[Autoplay]}
                            pagination
                            className="mySwiper"
                        >
                            {
                                data.map((product, index) => {

                                    return (
                                        <SwiperSlide style={{margin: "0 !important"}} key={index}>
                                            <FlickityItem product={product} loading={loading}/>
                                        </SwiperSlide>
                                    )
                                })
                            }

                        </Swiper>
                    </div>
                </>
            }
        </>
    )
}
export default Flickity;