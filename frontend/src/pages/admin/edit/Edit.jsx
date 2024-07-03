import React, {useEffect, useState} from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./edit.scss";
import FormInput from "../../../components/formInput/FormInput";
import {getUserById} from "../../../apis/users";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import {getListImages, getProductById} from "../../../apis/products";
import {getCategoryById} from "../../../apis/category";
import {decrypt} from "../../../utils/crypto";
import {getBannerById} from "../../../apis/banner";
import {enqueueSnackbar} from "notistack";

const Edit = ({inputs, type, title}) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const params = useParams();
    const {id} = params;
    const ids = decrypt(id);
    const [data, setData] = useState({});
    const [listImages, setListImages] = useState([]);
    const [roles, setRoles] = useState()
    const navigate = useNavigate();
    const fetchApi = async () => {
            let data;
            let images = [];
            if (type === "users") {
                try {
                    data = await getUserById(user?.data.accessToken, ids, axiosJWT);
                    console.log(data);
                } catch (error) {
                    console.log(error);
                }
            }
            if (type === "products") {
                const res = await getProductById(ids);
                const resImage = await getListImages(ids);
                data = res;
                images = resImage;
            }
            if (type === "categories") {
                data = await getCategoryById(ids);
            }
            if (type === "banners") {
                const res = await getBannerById(ids);
                //  const resImage = await getListImages(ids);
                data = res?.data.data;
                // images = resImage;
            }
            setData(data);
            setListImages(images);
        }
    ;
    useEffect(async () => {
            if (!user) {
                enqueueSnackbar("Vui lòng đăng nhập để tiếp tục", {variant: "error"});
                navigate("/admin/login")
            }
            await fetchApi();
            console.log(data)
        }, [id]
    )
    ;
    return (
        <div className="edit">
            <Sidebar/>
            <div className="editContainer">
                <Navbar/>
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <FormInput
                        inputs={inputs}
                        type={type}
                        images={listImages}
                        data={data}
                        isEdit={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Edit;
