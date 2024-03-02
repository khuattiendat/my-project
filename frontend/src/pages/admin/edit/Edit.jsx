import React, {useContext, useEffect, useState} from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Loading from "../../../components/Loading/Loading";
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
import {DarkModeContext} from "../../../context/darkModeContext";

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
    useEffect(() => {
            const fetchApi = async () => {
                    let data;
                    let images = [];
                    if (type === "users") {
                        try {
                            const res = await getUserById(user?.data.accessToken, ids, axiosJWT);
                            data = res;
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
                        const res = await getCategoryById(ids);
                        data = res;
                    }
                    setData(data);
                    setListImages(images);
                }
            ;
            fetchApi();
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
