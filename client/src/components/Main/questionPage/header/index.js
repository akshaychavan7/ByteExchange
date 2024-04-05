import AskAQuestionButton from "../../askAQuestionButton";
import "./index.css";
import OrderButton from "./orderButton";

const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}) => {
  return (
    <div>
      <div className="space_between right_padding">
        <div className="bold_title">{title_text}</div>
        <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
      </div>
      <div className="space_between right_padding">
        <div id="question_count">{qcnt} questions</div>
        <div className="btns">
          <OrderButton message={"Newest"} setQuestionOrder={setQuestionOrder} />
          <OrderButton message={"Active"} setQuestionOrder={setQuestionOrder} />
          <OrderButton
            message={"Unanswered"}
            setQuestionOrder={setQuestionOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionHeader;
