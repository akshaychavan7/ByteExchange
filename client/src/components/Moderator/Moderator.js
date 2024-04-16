import "./Moderator.css";
import {
  AppBar,
  IconButton,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  getReportedQuestions,
  deleteQuestion,
  resolveQuestion,
} from "../../services/questionService";
import {
  getReportedAnswers,
  deleteAnswer,
  resolveAnswer,
} from "../../services/answerService";
import {
  getReportedComments,
  deleteComment,
  resolveComment,
} from "../../services/commentService";
import logout from "../../services/logoutService";
import { useAlert } from "../../context/AlertContext";
import ProfileAvatar from "../Main/Avatar/AltAvatar";
import Logout from "@mui/icons-material/Logout";
import { Check, Close } from "@mui/icons-material";
import AuthorMeta from "../Main/AuthorMeta/AuthorMeta";
import { getMetaData } from "../../tool";
import Loader from "../Utility/Loader/Loader";

export default function Moderator() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user_details"));
  const alert = useAlert();
  const [type, setType] = useState("question");
  const [reportedData, setReportedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleChange = (event, newOrder) => {
    if (newOrder !== null) setType(newOrder);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "profile-popover" : undefined;

  const handleSignOut = async () => {
    const response = await logout();
    if (response.status === 200) {
      localStorage.removeItem("user_details");
      alert.showAlert("You have successfully logged out", "success");
      navigate("/login");
    } else {
      alert.showAlert("Could not log out, please try again!", "error");
    }
  };

  const handleDelete = (id) => {
    switch (type) {
      case "question":
        deleteQuestion(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      case "answer":
        deleteAnswer(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      case "comment":
        deleteComment(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      default:
        console.log("default");
    }
  };

  const handleResolve = (id) => {
    switch (type) {
      case "question":
        resolveQuestion(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      case "answer":
        resolveAnswer(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      case "comment":
        resolveComment(id).then(() => {
          setReportedData(reportedData.filter((data) => data._id !== id));
        });
        break;
      default:
        console.log(type);
        console.log("default");
    }
  };

  useEffect(() => {
    setLoading(true);
    switch (type) {
      case "question":
        getReportedQuestions().then((res) => {
          setReportedData(res);
          setLoading(false);
        });
        break;
      case "answer":
        getReportedAnswers().then((res) => {
          setReportedData(res);
          setLoading(false);
        });
        break;
      case "comment":
        getReportedComments().then((res) => {
          setReportedData(res);
          setLoading(false);
        });
        break;
      default:
        console.log("default");
    }
  }, [type]);

  function getPostDetails(data) {
    let author = "",
      profilePic = "",
      date = null;
    switch (type) {
      case "question":
        author = data?.asked_by?.firstname + " " + data?.asked_by?.lastname;
        profilePic = data?.asked_by?.profilePic;
        date = data?.ask_date_time;
        break;
      case "answer":
        author = data?.ans_by?.firstname + " " + data?.ans_by?.lastname;
        profilePic = data?.ans_by?.profilePic;
        date = data?.ans_date_time;
        break;
      case "comment":
        author =
          data?.commented_by?.firstname + " " + data?.commented_by?.lastname;
        profilePic = data?.commented_by?.profilePic;
        date = data?.comment_date_time;
        break;
    }
    return (
      <div className="single-post">
        <div className="post-description">{data.description}</div>
        <Stack direction="column" spacing={1}>
          <AuthorMeta name={author} profilePic={profilePic} />
          <div className="answer_question_meta">
            {getMetaData(new Date(date))}
          </div>
        </Stack>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <AppBar position="fixed" className="header-moderator">
        <Typography variant="h5" noWrap component="div" sx={{ ml: 2 }}>
          Stack Overflow
        </Typography>

        <Tooltip
          title={`${user.firstname} ${user.lastname}`}
          placement="bottom"
          aria-describedby={id}
          onClick={handlePopoverClick}
        >
          <div className="header-avatar">
            <ProfileAvatar
              name={user?.firstname + " " + user?.lastname}
              image={user?.profilePic}
            />
          </div>
        </Tooltip>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography className="profile-popover" onClick={handleSignOut}>
            <Logout /> &nbsp; Sign Out
          </Typography>
        </Popover>
      </AppBar>

      <div id="body" className="moderator-container">
        <div className="controls">
          <h4 style={{ color: "#303030" }}>
            {reportedData.length} reported {type}s
          </h4>
          <div>
            <ToggleButtonGroup
              color="primary"
              size="small"
              value={type}
              exclusive
              onChange={handleChange}
            >
              <ToggleButton
                value={"question"}
                onClick={() => setType("question")}
              >
                Question
              </ToggleButton>
              <ToggleButton value={"answer"} onClick={() => setType("answer")}>
                Answer
              </ToggleButton>
              <ToggleButton
                value={"comment"}
                onClick={() => setType("comment")}
              >
                Comment
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>

        <div className="moderated-list">
          {reportedData.length === 0 && (
            <h4 style={{ textAlign: "center" }}>No reported {type}s found</h4>
          )}

          {reportedData?.map((data, idx) => (
            <div key={idx} className="content-row">
              {getPostDetails(data)}

              <div className="icons">
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(data._id)}>
                    <Close color="warning" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ignore">
                  <IconButton onClick={() => handleResolve(data._id)}>
                    <Check color="success" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
