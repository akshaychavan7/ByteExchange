import { useState } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "./Header.css";

const Header = ({ setQuestionPage, search }) => {
  const [searchText, setSearchText] = useState(search);

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const pageTitle = searchText === "" ? "All Questions" : `Search Results`;
      setQuestionPage(searchText, pageTitle);
    }
  };

  return (
    <AppBar id="header" position="static">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Stack Overflow
        </Typography>
        <input
          id="searchBar"
          className="search-bar"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search ..."
          type="text"
          onKeyUp={handleSearch}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

/*
import { useState } from "react";
import { IconButton, Toolbar, Typography, styled } from "@mui/material";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";

const Header = ({ setQuestionPage, search, open, setOpen }) => {
  const [searchText, setSearchText] = useState(search);
  const drawerWidth = 240;

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const pageTitle = searchText === "" ? "All Questions" : `Search Results`;
      setQuestionPage(searchText, pageTitle);
    }
  };

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <AppBar id="header" position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(!open)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Stack Overflow
        </Typography>
        <input
          id="searchBar"
          className="search-bar"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search ..."
          type="text"
          onKeyUp={handleSearch}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;

*/
