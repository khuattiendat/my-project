import React, {useEffect, useState} from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./edit.scss";
import FormInput from "../../../components/formInput/FormInput";
import {getUserById} from "../../../apis/users";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {createAxios} from "../../../utils/createInstance";
import {loginSuccess} from "../../../redux/authSlice";
import {getListImages, getProductById} from "../../../apis/products";
import {getCategoryById} from "../../../apis/category";
import {decrypt} from "../../../utils/crypto";
import {getBannerById} from "../../../apis/banner";

const Edit = ({inputs, type, title}) => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, loginSuccess);
    const params = useParams();
    const {id} = params;
    const ids = decrypt(id);
    const [data, setData] = useState({});
    const [listImages, setListImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState()
    useEffect(async () => {
            const fetchApi = async () => {
                    let data;
                    let images = [];
                    if (type === "users") {
                        try {
                            setLoading(true)
                            data = await getUserById(user?.data.accessToken, ids, axiosJWT);
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                            console.log(error);
                        }
                    }
                    if (type === "products") {
                        try {
                            setLoading(true)
                            const res = await getProductById(ids);
                            const resImage = await getListImages(ids);
                            data = res;
                            images = resImage;
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                            console.log(error);
                        }
                    }
                    if (type === "categories") {
                        try {
                            setLoading(true)
                            data = await getCategoryById(ids);
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                            console.log(error);
                        }
                    }
                    if (type === "banners") {
                        try {
                            setLoading(true)
                            const res = await getBannerById(ids);
                            //  const resImage = await getListImages(ids);
                            data = res?.data.data;
                            // images = resImage;
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                            console.log(error);
                        }

                    }
                    setData(data);
                    setListImages(images);
                }
            ;
            await fetchApi();
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
                        loadingApi={loading}
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
