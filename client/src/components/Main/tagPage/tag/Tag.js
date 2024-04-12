import React from "react";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Tag = ({ t, clickTag }) => {
  return (
    <Grid item xs="auto" onClick={() => clickTag(t.name)}>
      <Paper
        elevation={3}
        sx={{
          width: 200,
          padding: 2,
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Chip
          color="primary"
          label={t.name}
          sx={{ mb: 1, background: "#e4ecff", color: "#7793ff" }}
        />
        <Typography variant="body2">{t.qcnt} questions</Typography>
      </Paper>
    </Grid>
  );
};

export default Tag;
