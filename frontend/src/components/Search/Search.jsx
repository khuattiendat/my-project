import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import "./search.scss";
import { useDispatch } from "react-redux";
import { setIsLoadingSearch } from "../../redux/searchSlice";
const Search = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener("keyup", handlerSearch);
    return () => {
      window.removeEventListener("keyup", handlerSearch);
    };
  }, [keyword]);
  const handlerSearch = (e) => {
    if (e.keycode === 13) {
        dispatch(setIsLoadingSearch(true));
        
    }
  };
  return (
    <div className="search-container">
      <div className="form-input">
        <input
          type="text"
          placeholder="search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default Search;
