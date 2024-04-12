import { useState } from "react";
import "./index.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AskAQuestionButton from "../../AskAQuestionButton/AskAQuestionButton";

const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}) => {
  const [selectedOrder, setSelectedOrder] = useState("newest");

  const handleChange = (event, newOrder) => {
    setSelectedOrder(newOrder);
  };
  return (
    <div>
      <div className="space_between right_padding">
        <div className="bold_title">{title_text}</div>
        <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
      </div>
      <div className="space_between right_padding">
        <div id="question_count">{qcnt} questions</div>
        <div className="btns">
          <ToggleButtonGroup
            color="primary"
            size="small"
            value={selectedOrder}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton
              value={"newest"}
              onClick={() => setQuestionOrder("newest")}
            >
              Newest
            </ToggleButton>
            <ToggleButton
              value={"active"}
              onClick={() => setQuestionOrder("active")}
            >
              Active
            </ToggleButton>
            <ToggleButton
              value={"unanswered"}
              onClick={() => setQuestionOrder("unanswered")}
            >
              Unanswered
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
