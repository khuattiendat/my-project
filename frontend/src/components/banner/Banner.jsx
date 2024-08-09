import {Swiper, SwiperSlide} from "swiper/react";
import "./banner.scss"
import "swiper/css";
import {Autoplay} from "swiper/modules";
import Loading from "../Loading/loadingPage/LoadingPage";

const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
const Banner = ({data, loading}) => {
    console.log(loading)
    return (
        <div className={"banner"}>
            {loading ? <Loading/> : (
                <>
                    {data && (<Swiper spaceBetween={30}
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
                                    <img src={item.image_url ? BASE_URL_SERVER + "/uploads/" + item.image_url : ""}
                                         alt="banner"
                                         key={item.id}/>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>)}
                </>
            )}


        </div>
    )
}
export default Banner