import "./menuCategory.scss"
import {Link} from "react-router-dom";
import {encrypt} from "../../../utils/crypto";

const MenuCategory = ({data}) => {
    return (
        <div className={"menu"}>
            <ul className={"menu_list"}>
                {data?.map((item, index) => {
                    return (
                        <Link key={index} style={{textDecoration: "none", color: "#000"}}
                              to={`/categories/${encrypt(item.id.toString())}`}>
                            <li className={"menu_item"} key={index}>
                                <span className={"menu_item-name"}>{item.name}</span>
                                <span className={"menu_item-quantity"}>{item.productCount} sản phẩm</span>
                            </li>
                        </Link>

                    )
                })}

            </ul>
        </div>
    )
}
export default MenuCategory