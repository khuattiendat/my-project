import "./new.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import {useDispatch, useSelector} from "react-redux";
import FormInput from "../../../components/formInput/FormInput";

const New = ({...props}) => {
    const {inputs, title, type} = props;
    console.log(inputs)

    return (
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar/>
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <FormInput
                        inputs={inputs}
                        type={type}
                    />
                </div>
            </div>
        </div>
    );
};

export default New;
