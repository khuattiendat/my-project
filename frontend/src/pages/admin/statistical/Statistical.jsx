import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import "./statistical.scss"

const Statistical = () => {
    return (
        <div className={"statistical"}>
            <Sidebar/>
            <div className="statisticalContainer">
                <Navbar/>

            </div>
        </div>
    );
}
export default Statistical;