import { useState } from "react";
import "./index.css";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AskAQuestionButton from "../../AskAQuestionButton/AskAQuestionButton";
import { constants } from "../../../../config";

const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(constants.ORDER_NEWEST);

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
              value={constants.ORDER_NEWEST}
              onClick={() => setQuestionOrder(constants.ORDER_NEWEST)}
            >
              Newest
            </ToggleButton>
            <ToggleButton
              value={constants.ORDER_ACTIVE}
              onClick={() => setQuestionOrder(constants.ORDER_ACTIVE)}
            >
              Active
            </ToggleButton>
            <ToggleButton
              value={constants.ORDER_UNANSWERED}
              onClick={() => setQuestionOrder(constants.ORDER_UNANSWERED)}
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
