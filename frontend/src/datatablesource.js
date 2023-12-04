const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
export const userColumns = [
    {field: "id", headerName: "ID", width: 50},
    {
        field: "name",
        headerName: "Họ và tên",
        width: 180,
    },
    {
        field: "email",
        headerName: "Email",
        width: 230,
    },

    {
        field: "phone_number",
        headerName: "Số điện thoại",
        width: 150,
    },
    {
        field: "address",
        headerName: "Địa chỉ",
        width: 200,
    },
];
export const productColumns = [
    {field: "id", headerName: "ID", width: 70},
    {
        field: "name",
        headerName: "Tên sản phẩm",
        width: 230,
        renderCell: (params) => {
            return (
                <div className="cellWithImg">
                    <img className="cellImg"
                         src={params.row.image ? BASE_URL_SERVER + "/uploads/" + params.row.image : "/images/user-icon.png"}
                         alt="avatar"/>
                    {params.row.name}
                </div>
            );
        },
    },
    {
        field: "price",
        headerName: "Giá sản phẩm",
        width: 150,
    },
    {
        field: "quantity",
        headerName: "Tồn kho",
        width: 100,
    },
    {
        field: "status",
        headerName: "Loại sản phẩm",
        width: 120,
        renderCell: (params) => {
            return (
                <div>
                    {params.row.Category.name}
                </div>
            );
        },
    },
    {
        field: "description",
        headerName: "Mô tả",
        width: 150,
    },
];
export const orderColumnClient = [
    {
        field: "order_id",
        headerName: "Mã đơn hàng",
        width: 150,
    },
    {
        field: "recipient_name",
        headerName: "Tên người nhận",
        width: 150,
    },
    {
        field: "recipient_phone",
        headerName: "SDT người nhận",
        width: 150,
    },
    {
        field: "address_delivery",
        headerName: "Địa chỉ nhận hàng",
        width: 180,
    },
    {
        field: "status_payment",
        headerName: "Thanh toán",
        width: 150,
    },
    {
        field: "status_delivery",
        headerName: "Giao hàng",
        width: 150,
    },
    {
        field: "total_money",
        headerName: "Tổng tiền",
        width: 140,
    },

]
export const orderColumns = [
    {field: "id", headerName: "ID", width: 70},
    {
        field: "order_id",
        headerName: "Mã đơn hàng",
        width: 150,
    },
    {
        field: "name",
        headerName: "Tên khách hàng",
        width: 150,
        renderCell: (params) => {
            return (
                <div>
                    {params.row.user?.name}
                </div>
            );
        },
    },
    {
        field: "status_payment",
        headerName: "Thanh toán",
        width: 150,
    },
    {
        field: "status_delivery",
        headerName: "Giao hàng",
        width: 150,
    },
    {
        field: "total_money",
        headerName: "Tổng tiền",
        width: 140,
    },
];
export const transactionColumns = [
    {field: "id", headerName: "ID", width: 50},
    {
        field: "user_name",
        headerName: "Tên khách hàng",
        width: 170,
    },
    {
        field: "user_phone",
        headerName: "Số điện thoại",
        width: 130,
    },
    {
        field: "payment_method",
        headerName: "Phương thức thanh toán",
        width: 180,
    },
    {
        field: "status_payment",
        headerName: "Trạng thái giao dịch",
        width: 160,
    },
    {
        field: "amount",
        headerName: "Tổng tiền",
        width: 120,
    },
]
export const categoryColumn = [
    {field: "id", headerName: "ID", width: 70},
    {
        field: "name",
        headerName: "Tên loại",
        width: 200,
    },
]