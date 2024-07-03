import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import CallIcon from '@mui/icons-material/Call';
import StorefrontIcon from '@mui/icons-material/Storefront';
import "./footer.scss"
import {Link} from "react-router-dom";
import 'tippy.js/dist/tippy.css'
import Tippy from "@tippyjs/react";

const Footer = () => {
    return <div className={"footer"}>
        <div className={"footer_container"}>
            <div className={"footer_item"}>
                <Link to={"/"}>
                    <img src="/images/logo.png" alt=""/>
                </Link>
                <ul className={"footer_item_left"}>
                    <li>
                        <Tippy
                            offset={[0, 20]}
                            delay={100}
                            placement={"top"}
                            content={<span>Follow on Facebook</span>}>
                            <Link to={"#"}>
                                <FacebookOutlinedIcon/>
                            </Link>

                        </Tippy>
                    </li>
                    <li>
                        <Tippy
                            offset={[0, 20]}
                            delay={100}
                            placement={"top"}
                            content={<span>Follow on Instagram</span>}>
                            <Link to={"#"}>
                                <InstagramIcon/>
                            </Link>
                        </Tippy>
                    </li>
                    <li>
                        <Tippy
                            offset={[0, 20]}
                            delay={100}
                            placement={"top"}
                            content={<span>Follow on Twitter</span>}>
                            <Link to={"#"}>
                                <TwitterIcon/>
                            </Link>
                        </Tippy>
                    </li>
                </ul>
            </div>
            <div className={"footer_item"}>
                <span>VỀ MONA</span>
                <ul>
                    <li>
                        <Link to={"#"}>
                            Câu Chuyện Mona
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Triết Lý Sản Phẩm Và Sáng Tạo
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Cảm Nhận Khách Hàng
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Tuyển Dụng
                        </Link>
                    </li>
                </ul>
                <span>LIÊN HỆ</span>
                <ul>
                    <li>
                        <Link to={"#"}>
                            <CallIcon/>
                            <span style={{marginLeft: "4px"}}>0383878902</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            <StorefrontIcon/>
                            <span style={{marginLeft: "4px"}}>Hà Nội</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={"footer_item"}>
                <span>CHÍNH SÁCH</span>
                <ul>
                    <li>
                        <Link to={"#"}>
                            Đổi Trả
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Mua Lại
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Bảo Hành
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Điều Khoản Và Điều Kiện
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Bảo Mật
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={"footer_item"}>
                <span>KIẾN THỨC VÀ HƯỚNG DẪN</span>
                <ul>
                    <li>
                        <Link to={"#"}>
                            Blog Trang sức
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Kiến Thức Về Kim Cương
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Kiến Thức Về Kim Loại Đá Quý
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Kiến Thức Về Ngọc Trai
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Kinh Nghiệm Chọn Nhẫn Cưới
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Kinh Nghiệm Chọn Nhẫn Đính Hôn
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            Hướng Dẫn Bảo Quản Trang Sức
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
}
export default Footer