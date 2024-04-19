import React from "react";
import { Box, Typography, Button } from "@mui/material";
import NotFoundImage from "../../assets/images/page_not_found.svg";

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <img
        src={NotFoundImage}
        alt="Not Found"
        style={{ width: "300px", marginBottom: "20px" }}
      />
      <Typography variant="h4" align="center" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button variant="contained" color="primary" href="/home">
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
