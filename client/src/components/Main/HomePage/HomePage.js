import { constants } from "../../../config";
import { sortByActiveOrder } from "../../../util/utils";
import QuestionHeader from "../questionPage/header";
import Question from "../questionPage/question";
import "./HomePage.css";
import { useEffect, useState } from "react";

const HomePage = ({
  title_text = "Trending Questions",
  order,
  search,
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
    if (search === "" && order === constants.ORDER_NEWEST) {
      setFilteredQlist(qlist);
      return;
    }
    let list = qlist.filter((q) => {
      return q.title.toLowerCase().includes(search.toLowerCase());
    });
    switch (order) {
      case constants.ORDER_NEWEST:
        list.sort((a, b) => {
          return new Date(b.ask_date_time) - new Date(a.ask_date_time);
        });
        break;
      case constants.ORDER_ACTIVE:
        list = sortByActiveOrder(list);
        break;
      case constants.ORDER_UNANSWERED:
        list = list.filter((q) => q.answers.length === 0);
        break;
    }
    setFilteredQlist(list);
  }, [order, search]);

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
      {title_text === "Search Results" && !filteredQlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
    </>
  );
};

export default HomePage;
