import {Swiper, SwiperSlide} from "swiper/react";
import "./banner.scss"
import "swiper/css";
import {Autoplay} from "swiper/modules";
import Loading from "../Loading/Loading";

const Banner = ({data}) => {
    return (
        <div className={"banner"}>
            {data ? (<Swiper spaceBetween={30}
                             centeredSlides={true}
                             loop={true}
                             autoplay={{
                                 delay: 2500,
                                 disableOnInteraction: false,
                             }}
                             modules={[Autoplay]}
                             className="mySwiper">
                {data.map((item, index) => {
                    return (
                        <SwiperSlide key={item.id}>
                            <img src={item.url} alt="banner" key={item.id}/>
                        </SwiperSlide>
                    )
                })}
            </Swiper>) : <Loading/>}

        </div>
    )
}
export default Banner