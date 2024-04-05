import { useState } from "react";
import "./index.css";

const Header = ({ setQuesitonPage, search }) => {
  const [searchText, setSearchText] = useState(search);
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const pageTitle = searchText === "" ? "All Questions" : `Search Results`;
      setQuesitonPage(searchText, pageTitle);
    }
  };

  return (
    <div id="header" className="header">
      <div className="title">Fake Stack Overflow</div>
      <input
        id="searchBar"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search ..."
        type="text"
        onKeyUp={handleSearch}
      />
    </div>
  );
};

export default Header;
