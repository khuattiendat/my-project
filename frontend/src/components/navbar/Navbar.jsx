import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import Popper from "../popper/Popper";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [showPopper, setShowPopper] = useState(false);
  const user = useSelector((state) => state.auth.login?.currentUser);
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <span className="logo">WELCOME: {user?.data.user.name}</span>
        </div>
        <div className="items">
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div>

          <div className="item">
            <img
              src="/images/user-icon.png"
              alt="avatar"
              className="avatar"
              onClick={() => setShowPopper(!showPopper)}
            />
            {showPopper && <Popper />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
