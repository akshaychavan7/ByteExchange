import {
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import "./ProfilePage.css";
import ProfileAvatar from "../Main/Avatar/AltAvatar";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../services/userService";
import Loader from "../Utility/Loader/Loader";
import { useAlert } from "../../context/AlertContext";
import { Close } from "@mui/icons-material";
import { memberSince } from "../../util/utils";
import Chart from "./Chart";
import List from "./List";

export default function ProfilePage({ username, setViewUserProfile }) {
  const [user, setUser] = useState(null);
  const alert = useAlert();

  useEffect(() => {
    getUserDetails(username)
      .then((data) => {
        setUser(data.userDetails);
      })
      .catch((e) => {
        console.error(e);
        alert.showAlert("Could not fetch user details", "error");
        setUser(null);
        setViewUserProfile({ view: false, username: "" });
      });
  }, []);

  if (!user) {
    return <Loader />;
  }

  return (
    <div>
      <Tooltip title="Close" placement="top">
        <Close
          onClick={() => {
            setViewUserProfile({ view: false, username: "" });
          }}
          sx={{
            cursor: "pointer",
            float: "right",
            fontSize: "2rem",
            color: "darkgray",
          }}
        />
      </Tooltip>
      <Stack direction="row" alignItems="center" spacing={4}>
        <ProfileAvatar
          name={`${user.firstname} ${user.lastname}`}
          image={user.profilePic}
          width={120}
          height={120}
        />
        <Box>
          <Typography variant="h5">{`${user.firstname} ${user.lastname}`}</Typography>
          <Box
            display="flex"
            direction=""
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2">
              <span className="field-name">Reputation:</span> {user.reputation}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="body2">
              <span className="field-name">Location:</span> {user.location}
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="body2">
              <span className="field-name">Member since:</span>{" "}
              {memberSince(user.joiningDate)}
            </Typography>
          </Box>
          <Box sx={{ mt: 1, ml: "-2px" }}>
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
          </Box>
        </Box>
        {/* <Divider orientation="vertical" flexItem /> */}
        <Chart
          questionsCount={user?.questions?.length}
          answersCount={user?.answers?.length}
          commentsCount={user?.comments?.length}
        />
      </Stack>
      <Divider sx={{ m: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <List list={user?.questions} title="Questions" type="question" />
        </Grid>
        <Grid item xs={6}>
          <List list={user?.answers} title="Answers" type="answer" />
        </Grid>
      </Grid>
    </div>
  );
}
