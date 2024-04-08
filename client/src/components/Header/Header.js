import { useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router";
import logout from "../../services/logoutService";

const Header = ({ setQuestionPage, search }) => {
  const [searchText, setSearchText] = useState(search);
  let navigate = useNavigate();
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const pageTitle = searchText === "" ? "All Questions" : `Search Results`;
      setQuestionPage(searchText, pageTitle);
    }
  };

  const handleSignOut = async () => {
    const response = await logout();
    if (response.status === 200) {
      navigate("/login");
    } else {
      alert.showAlert("Could not log out, please try again!", "error");
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
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Header;
