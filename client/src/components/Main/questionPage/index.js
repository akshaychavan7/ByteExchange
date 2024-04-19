import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";

const QuestionPage = ({
  title_text = "All Questions",
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
  setViewUserProfile,
  setSelected,
  handleUsers,
}) => {
  const [qlist, setQlist] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionsByFilter(order, search);
      setQlist(res || []);
    };

    fetchData().catch((e) => console.log(e));
  }, [order, search]);

  const getQuestionsList = () => {
    if (qlist.length === 0)
      return <h2 className="center">No questions found</h2>;

    return qlist.map((q, idx) => (
      <Question
        q={q}
        key={idx}
        clickTag={clickTag}
        handleAnswer={handleAnswer}
        setViewUserProfile={setViewUserProfile}
        setSelected={setSelected}
        handleUsers={handleUsers}
      />
    ));
  };

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {getQuestionsList()}
      </div>
    </>
  );
};

export default QuestionPage;
