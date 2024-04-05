import React from "react";
import { Container, Typography, Button, Box, Grid } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const UnauthorizedAccess = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <LockOutlinedIcon sx={{ fontSize: "4rem", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Unauthorized Access
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={3}>
            You are not authorized to view this page. Please log in or contact
            the administrator for assistance.
          </Typography>
          <Grid container justifyContent="center">
            <Grid item>
              <Button variant="contained" color="primary" href="/login">
                Log In
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UnauthorizedAccess;
