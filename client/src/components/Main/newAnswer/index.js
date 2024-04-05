import { useState } from "react";
import "./index.css";
import Input from "../baseComponents/input";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";

const NewAnswer = ({ qid, addAnswer, handleAnswer }) => {
  const [username, setUsername] = useState("");
  const [answerText, setAnswerText] = useState("");

  const [usernameErr, setUsernameErr] = useState("");
  const [textErr, setTextErr] = useState("");

  const postAnswer = () => {
    let errFlag = false;
    if (username.length === 0) {
      setUsernameErr("Username cannot be empty");
      errFlag = true;
    }
    if (answerText.length === 0) {
      setTextErr("Answer text cannot be empty");
      errFlag = true;
    }

    if (errFlag) return;

    let answer = {
      text: answerText,
      ansBy: username,
    };

    addAnswer(qid, answer);
    handleAnswer(qid);
  };

  return (
    <Form>
      <Input
        title={"Username"}
        hint={"Enter your username"}
        id={"answerUsernameInput"}
        val={username}
        setState={setUsername}
        err={usernameErr}
      />
      <Textarea
        title={"Answer Text"}
        hint={"Add answer details"}
        id={"answerTextInput"}
        val={answerText}
        setState={setAnswerText}
        err={textErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
