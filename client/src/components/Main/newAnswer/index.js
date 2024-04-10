import { useState } from "react";
import "./index.css";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";

const NewAnswer = ({ handleAddAnswer }) => {
  const [answerDescription, setAnswerDescription] = useState("");

  const [descriptionErr, setDescriptionErr] = useState("");

  const postAnswer = () => {
    let errFlag = false;
    if (answerDescription.length === 0) {
      setDescriptionErr("Answer Description cannot be empty");
      errFlag = true;
    }

    if (errFlag) return;

    let answer = {
      description: answerDescription,
    };

    handleAddAnswer(answer);
  };

  return (
    <Form>
      <Textarea
        title={"Answer Description"}
        hint={"Add answer details"}
        id={"answerTextInput"}
        val={answerDescription}
        setState={setAnswerDescription}
        err={descriptionErr}
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
