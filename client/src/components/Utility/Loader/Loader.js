import React from "react";
import { Backdrop, CircularProgress, Stack } from "@mui/material";

const Loader = () => {
  return (
    <Backdrop
      open={true}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: "#fff" }}
    >
      <Stack spacing={2} direction="column" alignItems="center">
        <CircularProgress />
        <div>
          <strong>Loading</strong>
        </div>
      </Stack>
    </Backdrop>
  );
};

export default Loader;
