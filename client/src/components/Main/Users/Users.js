import "./Users.css";
import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import { Chip, Grid, Typography, TextField } from "@mui/material";
import ProfileAvatar from "../Avatar/AltAvatar";

const Users = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.firstname + " " + user.lastname;
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <>
      <TextField
        label="Search User by Name or Username"
        size="small"
        autoFocus={true}
        className="search-user"
        color="primary"
        variant="outlined"
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Grid
        container
        direction="row"
        columnSpacing={3}
        rowSpacing={2}
        sx={{ padding: "30px" }}
      >
        {filteredUsers.length === 0 && (
          <h2 style={{ width: "100%", textAlign: "center" }}>User not found</h2>
        )}
        {filteredUsers.map((user, index) => (
          <Grid key={index} item xs={"auto"}>
            {" "}
            {/* Set xs={6} to occupy half of the row */}
            <Paper
              className="user-card"
              elevation={3}
              sx={{ maxWidth: 300, padding: "13px" }}
            >
              <Grid container alignItems="center" sx={{ flexGrow: 1 }}>
                <Grid item>
                  <div style={{ marginRight: "16px" }}>
                    <ProfileAvatar name={user.name} image={user.profilePic} />
                  </div>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.location}
                  </Typography>
                </Grid>
              </Grid>
              <div style={{ marginTop: "15px" }}>
                {user?.technologies?.map((tech, index) => (
                  <Chip
                    color="primary"
                    size="small"
                    key={index}
                    label={tech}
                    variant="outlined"
                    sx={{ marginRight: "8px", marginBottom: "8px" }}
                  />
                ))}
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Users;
