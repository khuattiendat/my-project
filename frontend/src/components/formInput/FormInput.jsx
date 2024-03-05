import React, {useEffect, useState} from "react";
import {checkEmail, checkPhone} from "../../utils/validator";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {createAxios} from "../../utils/createInstance";
import {loginSuccess} from "../../redux/authSlice";
import {addUser, getAllRole, updateUser} from "../../apis/users";
import {
    addCategory,
    getAllCategory,
    updateCategory,
} from "../../apis/category";
import {addProduct, updateProduct} from "../../apis/products";
import {showAlertConfirm} from "../../utils/showAlert";
import {formatPrice} from "../../utils/format";
import {enqueueSnackbar} from "notistack";
import {checkGender} from "../../utils/checkStatus";
import {LoadingButton} from "@mui/lab";
import {addBanner, updateBanner} from "../../apis/banner";

const FormInput = (props) => {
    const {inputs, type, data, isEdit, images = []} = props;
    const BASE_URL_SERVER = process.env.REACT_APP_BASE_URL_SERVER;
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [loading, setLoading] = useState(false);
    const [selectRole, setSelectRole] = useState([]);
    const [selectCategory, setSelectCategory] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [files, setFiles] = useState([]);
    const [value, setValue] = useState({});
    const [roleId, setRoleId] = useState("1");
    const [gender, setGender] = useState("1");
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const updateFieldChanged = (e) => {
        let newArr = {...value}; // copying the old datas array
        newArr[e.target.name] = e.target.value;
        return newArr;
    };
    const handleAddUser = async () => {
            setErrorMessage([]);
            const messages = [];
            if (password.length < 6) {
                messages.push("Mật khẩu phải có ít nhất 6 kí tự");
            }
            console.log(value)
            if (!value.name || !value.email || !value.phone || !value.address || !password) {
                messages.push("Vui lòng nhập đầy đủ thông tin")
            }
            if (checkEmail(value.email)) {
                messages.push("Email không hợp lệ !!!");
            }
            if (checkPhone(value.phone)) {
                messages.push("SDT không hợp lệ !!!");
            }
            let data = {
                name: value.name,
                email: value.email,
                password: password,
                phone_number: value.phone,
                gender,
                address: value.address,
                role_id: roleId,
            };
            if (messages.length > 0) {
                setErrorMessage(messages);
            } else {
                let confirm = await showAlertConfirm(
                    "Xác nhận thông tin ",
                    `
        Họ và tên: ${value.name},
        email: ${value.email},
        Password: ${password},
        Số điện thoại: ${value.phone},
        Giới tính: ${checkGender(gender)},
        Địa chỉ: ${value.address}
      `
                );
                if (confirm) {
                    try {
                        await addUser(data);
                        enqueueSnackbar("Thêm mới thành công", {variant: "success", autoHideDuration: 1000,});
                        navigate("/admin/users")
                    } catch (error) {
                        console.log(error.response.data.message);
                        error.response.data.message.forEach(message => {
                            enqueueSnackbar(message, {
                                variant: "error", autoHideDuration: 1000,
                            });
                        })
                    }
                }
            }
        }
    ;
    const handleAddBanner = async () => {
        const messages = [];
        setErrorMessage([]);
        let data = new FormData();
        if (!description) {
            messages.push("Vui lòng nhập mô tả")
        }
        data.append("title", description);
        files.forEach((file) => data.append("multiple_images", file));
        if (files.length <= 0) {
            messages.push("vui lòng chọn ít nhất 1 hình ảnh");
        }
        if (messages.length > 0) {
            setErrorMessage(messages);
        } else {
            let confirm = await showAlertConfirm("Bạn muốn thêm banner này")
            if (confirm) {
                try {
                    await addBanner(user?.data.accessToken, data, axiosJWT);
                    enqueueSnackbar("Thêm mới thành công", {variant: "success", autoHideDuration: 1000,});
                    navigate("/admin/banners")
                } catch (error) {
                    let messageError = JSON.stringify(error.response.data.message)
                    enqueueSnackbar(messageError, {variant: "error", autoHideDuration: 1000,})
                }
            }
        }
    }
    const handleAddProduct = async () => {
        const messages = [];
        setErrorMessage([]);
        let data = new FormData();
        if (!value.name || !value.price || !value.quantity || !value.discount || !description) {
            messages.push("Vui lòng nhập đầy đủ thông tin")
        }
        data.append("name", value.name);
        data.append("description", description);
        data.append("price", value.price);
        data.append("discount", value.discount);
        data.append("quantity", value.quantity);
        data.append("category_id", categoryId);
        files.forEach((file) => data.append("multiple_images", file));
        if (files.length <= 0) {
            messages.push("vui lòng chọn ít nhất 1 hình ảnh cho sản phẩn");
        }
        if (value.discount < 0 || value.discount > 100) {
            messages.push("Giảm giá không hợp lệ");
        }

        if (messages.length > 0) {
            setErrorMessage(messages);
        } else {
            let confirm = await showAlertConfirm(
                "Xác nhận thông tin ",
                `
        Tên sản phẩm: ${value.name},
        Giá: ${formatPrice(value.price)},
        Số lượng: ${value.quantity},
        Giảm giá: ${value.discount},
        Mô tả: ${description},
        Loại sản phẩm: ${categoryName}
      `
            );
            if (confirm) {
                await addProduct(user?.data.accessToken, data, navigate, axiosJWT);
            }
        }
    };
    const handleUpdateBanner = async (id) => {
        const messages = [];
        setErrorMessage([]);
        let data = new FormData();
        data.append("title", document.querySelector("[name='descriptions']").value ?? description);
        files.forEach((file) => data.append("multiple_images", file));
        if (messages.length > 0) {
            setErrorMessage(messages);
        } else {
            try {
                await updateBanner(user?.data.accessToken, data, id, axiosJWT)
                enqueueSnackbar("sửa thành công", {variant: "success", autoHideDuration: 1000})
                navigate("/admin/banners")
            } catch (error) {
                console.log(error)
                let messageError = JSON.stringify(error.response.data.message)
                enqueueSnackbar(messageError, {variant: "error", autoHideDuration: 1000,})
            }
        }
    }
    const handleUpdateProduct = async (id) => {
        const messages = [];
        setErrorMessage([]);
        let discount =
            document.querySelector("[name='discount']").value ?? value.discount;
        let data = new FormData();
        data.append(
            "name",
            document.querySelector("[name='name']").value ?? value.name
        );
        data.append(
            "description",
            document.querySelector("[name='descriptions']").value ?? description
        );
        data.append(
            "price",
            document.querySelector("[name='price']").value ?? value.price
        );
        data.append("discount", discount);
        data.append(
            "quantity",
            document.querySelector("[name='quantity']").value ?? value.quantity
        );
        if (discount < 0 || discount > 100) {
            messages.push("Giảm giá không hợp lệ");
        }
        data.append("category_id", categoryId);
        files.forEach((file) => data.append("multiple_images", file));
        if (messages.length > 0) {
            setErrorMessage(messages);
        } else {
            try {
                await updateProduct(user?.data.accessToken, data, id, navigate, axiosJWT);
                enqueueSnackbar("sửa thành công", {variant: "success", autoHideDuration: 1000})
                navigate("/admin/products")
            } catch (error) {
                let messageError = JSON.stringify(error.response.data.message)
                enqueueSnackbar(messageError, {variant: "error", autoHideDuration: 1000,})
            }
        }
    };
    const handleAddCategory = async () => {
        try {
            setLoading(true)
            const res = await getAllCategory();
            const check = res.find((item) => item.name === value.name);
            if (check) {
                enqueueSnackbar("Tên danh mục đã tồn tại", {variant: "error", autoHideDuration: 1000,})
                return;
            }
            let data = {
                name: value.name,
            };
            await addCategory(user?.data.accessToken, data, navigate, axiosJWT);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        } finally {
            setLoading(false)
        }


    };
    const handleUpdateUser = async (id) => {
        let name = document.querySelector("[name='name']").value ?? value.name;
        let email = document.querySelector("[name='email']").value ?? value.email;
        let phone = document.querySelector("[name='phone']").value ?? value.phone;
        let address = document.querySelector("[name='address']").value ?? value.address;
        let _gender = document.querySelector("[name='gender']").value ?? gender;
        let role_id = document.querySelector("[name='role']").value ?? roleId;
        if (!name || !email || !phone || !address) {
            setErrorMessage(["Vui lòng nhập đầy đủ thông tin"]);
            return;
        }
        let data = {
            name,
            email,
            phone_number: phone,
            gender: _gender,
            address,
            role_id,
        };

        try {
            await updateUser(user?.data.accessToken, data, id, axiosJWT);
            enqueueSnackbar("Cập nhật thành công", {variant: "success", autoHideDuration: 1000,});
            navigate("/admin/users");
        } catch (error) {
            let messageError = JSON.stringify(error.response.data.message)
            enqueueSnackbar(messageError, {variant: "error", autoHideDuration: 1000,})
        }

    };
    const handleUpdateCategory = async (id) => {
        let data = {
            name: document.querySelector("[name='name']").value ?? value.name,
        };
        await updateCategory(user?.data.accessToken, data, id, navigate, axiosJWT);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === "users" && isEdit) {
            handleUpdateUser(data.id);
        } else if (type === "users") {
            handleAddUser();
        } else if (type === "products" && isEdit) {
            handleUpdateProduct(data.id);
        } else if (type === "products") {
            handleAddProduct();
        } else if (type === "categories" && isEdit) {
            handleUpdateCategory(data.id);
        } else if (type === "categories") {
            handleAddCategory();
        } else if (type === "banners" && isEdit) {
            handleUpdateBanner(data.id)
        } else if (type === "banners") {
            handleAddBanner();
        }
    };
    useEffect(async () => {
        console.log(inputs);
        if (data !== undefined) {
            if (type === "users" && isEdit) {
                document.querySelector("[name='name']").value = data?.name;
                document.querySelector("[name='email']").value = data?.email;
                document.querySelector("[name='phone']").value = data?.phone_number;
                document.querySelector("[name='address']").value = data?.address;
            } else if (type === "products" && isEdit) {
                document.querySelector("[name='name']").value = data?.name;
                document.querySelector("[name='price']").value = data?.price;
                document.querySelector("[name='discount']").value = data?.discount;
                document.querySelector("[name='quantity']").value = data?.quantity;
                document.querySelector("[name='descriptions']").value =
                    data?.description;
            } else if (type === "categories") {
                document.querySelector("[name='name']").value = data?.name;
            } else if (type === "banners") {
                document.querySelector("[name='descriptions']").value = data?.title;
            }
        }
        const fetchApi = async () => {
            if (type === "users") {
                try {
                    const role = await getAllRole(user?.data.accessToken, axiosJWT);
                    setSelectRole(role);
                } catch (error) {
                    console.log(error)
                }
            } else if (type === "products") {
                const category = await getAllCategory();
                setSelectCategory(category);
                setCategoryId(category[0]?.id);
            }
        };
        await fetchApi();
    }, [data]);
    return (
        <>
            <div className="left">
                {type === "products" || type === "banners" && files.length > 0 ? (
                    <div className="show-img">
                        {files.map((item, index) => (
                            <img key={index} src={URL.createObjectURL(item)} alt="images"/>
                        ))}
                    </div>
                ) : (
                    <div className="show-img">
                        {images?.map((item, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL_SERVER}uploads/${item.image_url}`}
                                alt=""
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="right">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {type === "products" && (
                        <div className="formInput">
                            <label htmlFor="file">
                                Image: <DriveFolderUploadOutlinedIcon className="icon"/>
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => {
                                    setFiles([...e.target.files]);
                                }}
                                style={{display: "none"}}
                                multiple
                            />
                        </div>
                    )}
                    {type === "banners" && (
                        <div className="formInput">
                            <label htmlFor="file">
                                Image: <DriveFolderUploadOutlinedIcon className="icon"/>
                            </label>
                            <input
                                type="file"
                                id="file"
                                onChange={(e) => {
                                    setFiles([...e.target.files]);
                                }}
                                style={{display: "none"}}
                            />
                        </div>
                    )}
                    {inputs && inputs?.map((input) => (
                        <div className="formInput" key={input.id}>
                            <label>{input.label}</label>
                            <input
                                className="input"
                                type={input.type}
                                name={input.name}
                                required={input.required}
                                onChange={(e) => {
                                    setValue(updateFieldChanged(e));
                                }}
                                placeholder={input.placeholder}
                            />
                        </div>
                    ))}
                    {type === "users" ? (
                        <div className="formInput">
                            <label htmlFor="">Quyền</label>
                            <select name="role" id=""
                                    defaultValue={isEdit ? data.role_id : 1}
                                    onChange={(e) => setRoleId(e.target.value)}>
                                {selectRole && selectRole.map((item) => (
                                    <option
                                        selected={isEdit && data.role_id === item.id}
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <></>
                    )}
                    {type === "users" && !isEdit ? (
                        <div className="formInput">
                            <label htmlFor="">Mật khẩu</label>
                            <input
                                className="input"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required/>
                        </div>
                    ) : (
                        <></>
                    )}
                    {type === "products" ? (
                        <div className="formInput">
                            <label htmlFor="">Loại sản phẩm</label>
                            <select
                                name=""
                                id="category"
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setCategoryName(
                                        e.nativeEvent.target[e.nativeEvent.target.selectedIndex]
                                            .text
                                    );
                                }}
                            >
                                {selectCategory.map((item) => (
                                    <option
                                        selected={isEdit && data.category_id === item.id}
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <></>
                    )}
                    {type === "products" && (
                        <div className="formInput">
                            <label htmlFor="">Mô tả</label>
                            <textarea
                                name="descriptions"
                                id=""
                                rows="2"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    )}
                    {type === "banners" && (
                        <div className="formInput">
                            <label htmlFor="">Tiêu đề</label>
                            <textarea
                                name="descriptions"
                                id=""
                                rows="2"
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                    )}
                    {type === "users" ? (
                        <div className="formInput">
                            <label htmlFor="">Giới tính</label>
                            <select name="gender" id="" defaultValue={data?.gender}
                                    onChange={(e) => setGender(e.target.value)}>
                                <option selected={isEdit && data.gender == 1} value={1}>Nam</option>
                                <option selected={isEdit && data.gender == 0} value={0}>Nữ</option>
                            </select>
                        </div>
                    ) : (
                        <></>
                    )}
                    {errorMessage.length > 0 && (
                        <div className="formInput">
                            <label htmlFor="">ERROR</label>
                            {errorMessage.map((error, index) => (
                                <p className="error" key={index}>
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}

                    <div className="formInput">
                        <LoadingButton loading={loading} variant={"outlined"} type={"submit"}>
                            {isEdit ? "Cập nhật" : "Thêm mới"}
                        </LoadingButton>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormInput;
