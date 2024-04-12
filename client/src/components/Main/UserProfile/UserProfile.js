import "./UserProfile.css";
import React from "react";
import { Typography, Avatar, Chip, Grid } from "@mui/material";

const UserProfile = ({ user }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Avatar
          alt={`${user.firstname} ${user.lastname}`}
          src={user.profilePic || ""}
          sx={{ width: 150, height: 150 }}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        <Typography variant="h4">
          {user.firstname} {user.lastname}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          @{user.username}
        </Typography>
        <Typography variant="body1">Location: {user.location}</Typography>
        <Typography variant="body1">
          Joining Date: {user.joiningDate}
        </Typography>
        <Typography variant="body1">User Role: {user.userRole}</Typography>
        <Typography variant="body1">Technologies:</Typography>
        <Grid container spacing={1}>
          {user.technologies.map((tech, index) => (
            <Grid item key={index}>
              <Chip label={tech} variant="outlined" />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserProfile;
