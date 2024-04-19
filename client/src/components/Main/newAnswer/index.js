import { useState } from "react";
import "./index.css";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAlert } from "../../../context/AlertContext";

const NewAnswer = ({ handleAddAnswer }) => {
  const alert = useAlert();
  const [answerDescription, setAnswerDescription] = useState("");

  const postAnswer = () => {
    if (answerDescription.length === 0) {
      alert.showAlert("Answer Description cannot be empty", "error");
      return;
    }
    let answer = {
      description: answerDescription,
    };
    handleAddAnswer(answer);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          mt: 5,
        },
        backdropFilter: "blur(10px)",
      }}
    >
      <Paper
        sx={{
          width: "50%",
          borderRadius: "10px",
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 1,
          paddingBottom: 3,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2, mt: 2 }}>
          Add New Answer
        </Typography>
        <TextField
          id="description"
          label="Answer Description"
          variant="outlined"
          placeholder="Add answer details"
          value={answerDescription}
          onChange={(e) => setAnswerDescription(e.target.value)}
          sx={{ width: "100%" }}
          multiline
          rows={3}
          required
        />
        <div className="btn_indicator_container">
          <Button
            variant="contained"
            onClick={() => {
              postAnswer();
            }}
          >
            Post Answer
          </Button>
          <div className="mandatory_indicator">
            * indicates mandatory fields
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default NewAnswer;
