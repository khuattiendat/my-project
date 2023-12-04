import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import axios from "axios";

const Home = () => {

    const note = {
        da: "Thêm sdt, address vào order,",
        ad: " sửa status thành status_payment, status_delivery"
    }
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const listProducts = [
        {
            product_id: 48,
            quantity: 5,
            price: 1600000, // giá đã giảm giá
            total_money: 8000000,
            name: "test",
        },
        {
            product_id: 49,
            quantity: 1,
            price: 17800,
            total_money: 17800,
            name: "test",
        },
    ];
    const totalMoney = () => {
        let total = 0;
        for (let i = 0; i < listProducts.length; i++) {
            total += listProducts[i].total_money;
        }
        return total;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        axios
            .post("http://localhost:8088/api/payments/payByPaypal", {
                user_id: "23",
                user_name: "test",
                user_email: "test",
                user_phone: "test",
                note: "test",
                total_money: totalMoney(),
                payment: "thanh toán khi nhận hàng",
                listProducts: listProducts,
            })
            .then((res) => {
                console.log(res);
                window.location = res.data.forwardLink;
            })
            .catch((error) => {
                console.log(error.response);
            });
    };
    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <label htmlFor="">name</label>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <br/>
                <label htmlFor="">price</label>
                <input
                    type="text"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                />
                <br/>
                <button type="submit"> thanh toan</button>
            </form>
        </div>
    );
};

export default Home;
