import "./outstanding.scss"

const Outstansing = () => {
    return (
        <div className={"outstanding-container"}>
            <div className={"outstanding-content"}>
                <div className={"outstanding-item"}>
                    <img src="/images/chung_nhan_icon.png" alt=""/>
                    <h3>Đạt Chuẩn</h3>
                    <span>Đủ chứng nhận chất lượng</span>
                </div>
                <div className={"outstanding-item"}>
                    <img src="/images/chat_luong_icon.png" alt=""/>
                    <h3>Chất Lượng</h3>
                    <span>Đúng trọng lượng và hàm lượng</span>
                </div>
                <div className={"outstanding-item"}>
                    <img src="/images/thu_doi_cao_icon.png" alt=""/>
                    <h3>Cam Kết</h3>
                    <span>Thua mua đổi trọn đời</span>
                </div>
                <div className={"outstanding-item"}>
                    <img src="/images/bao_hanh_vuot_troi_icon.png" alt=""/>
                    <h3>Miễn Phí</h3>
                    <span>Làm sạch trọn đời</span>
                </div>
            </div>
        </div>
    )
}
export default Outstansing