import "./Moderator.css";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getReportedQuestions, deleteQuestion, resolveQuestion } from "../../services/questionService";
import { getReportedAnswers, deleteAnswer, resolveAnswer } from "../../services/answerService";
import { getReportedComments, deleteComment, resolveComment } from "../../services/commentService";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import logout from "../../services/logoutService";
import Logout from "@mui/icons-material/Logout";
import { useAlert } from "../../context/AlertContext";

export default function Moderator() {
    const navigate = useNavigate();
    const alert = useAlert();
    const [type, setType] = useState("question");
    const [reportedData, setReportedData] = useState([]);
    const handleChange = (event, newOrder) => {
        setType(newOrder);
    };

    
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
    }

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
                console.log(type)
                console.log("default");
        }
    }
    
    useEffect(() => {
        switch (type) {
            case "question":
                getReportedQuestions().then((res) => {
                    setReportedData(res);
                });
                break;
            case "answer":
                getReportedAnswers().then((res) => {
                    setReportedData(res);
                });
                break;
            case "comment":
                getReportedComments().then((res) => {
                    setReportedData(res);
                });
                break;
            default:
                console.log("default");
        }
    }, [type])

    return (
        <>
        <Logout onClick={handleSignOut} />
        <div className="btns">
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
            <ToggleButton
              value={"answer"}
              onClick={() => setType("answer")}
            >
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

        <div>
            {reportedData?.map((data, idx) => (
                <div key={idx}>
                    <h1>{data.description}</h1>
                    <DoneOutlineIcon onClick={() => handleDelete(data._id)} />
                    <ThumbDownOffAltIcon onClick={() => handleResolve(data._id)} />
                </div>
            ))}
        </div>
        </> 
    );
}
