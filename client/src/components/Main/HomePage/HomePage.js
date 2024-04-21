import { constants } from "../../../config";
import { sortByActiveOrder } from "../../../util/utils";
import QuestionHeader from "../questionPage/header";
import Question from "../questionPage/question";
import "./HomePage.css";
import { useEffect, useState } from "react";

const HomePage = ({
  order,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
  qlist,
  setViewUserProfile,
  setSelected,
  handleUsers,
}) => {
  const [filteredQlist, setFilteredQlist] = useState(qlist);

  useEffect(() => {
    setFilteredQlist(qlist);
  }, [qlist]);

  useEffect(() => {
    if ( order === constants.ORDER_NEWEST) {
      setFilteredQlist(qlist);
      return;
    } else if(order === constants.ORDER_ACTIVE) {
      setFilteredQlist(sortByActiveOrder(qlist));
    } else if(order === constants.ORDER_UNANSWERED) {
      setFilteredQlist(qlist.filter((q) => q.answers.length === 0));
    }
  }, [order]);

  return (
    <>
      <QuestionHeader
        title_text={"Trending Questions"}
        qcnt={filteredQlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {filteredQlist.map((q, idx) => (
          <Question
            q={q}
            key={idx}
            clickTag={clickTag}
            handleAnswer={handleAnswer}
            setViewUserProfile={setViewUserProfile}
            setSelected={setSelected}
            handleUsers={handleUsers}
          />
        ))}
        {filteredQlist.length === 0 && (
          <h2 className="center">No questions found</h2>
        )}
      </div>
    </>
  );
};

export default HomePage;
