import ProfileAvatar from "../Avatar/AltAvatar";
import Paper from "@mui/material/Paper";
import { Chip, Grid, Typography } from "@mui/material";
export default function UserCard({ user }) {
  return (
    <Grid item xs={"auto"}>
      <Paper
        className="user-card"
        elevation={3}
        sx={{ minWidth: 280, padding: "13px" }}
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
  );
}
