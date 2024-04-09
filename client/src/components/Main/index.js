import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import AnswerPage from "./answerPage";
import NewAnswer from "./newAnswer";
import NewQuestion from "./newQuestion";
import TagPage from "./tagPage";
import { addQuestion } from "../../services/questionService";
import { addAnswer } from "../../services/answerService";
import { getTagsWithQuestionNumber } from "../../services/tagService";

const Main = ({
  search = "",
  setSearch = () => {},
  title,
  setQuestionPage,
}) => {
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  const [selected, setSelected] = useState("q");
  let content = null;


  const clickTag = (tagName) => {
    setSearch(`[${tagName}]`);
    setPage("home");
  };
  const handleQuestions = () => {
    setSelected("q");
    setQuestionPage();
    setPage("home");
  };

  const handleTags = () => {
    setSelected("t");
    setPage("tag");
  };

  const handleNewQuestion = () => {
    setPage("newQuestion");
  };

  const handleAnswer = (qid) => {
    setQid(qid);
    setPage("answer");
  };

  const handleNewAnswer = () => {
    setPage("newAnswer");
  };

  const handleAddQuestion = async (question) => {
    await addQuestion(question);
    handleQuestions();
  };

  const getQuestionPage = (order, search) => {
    return (
      <QuestionPage
        title_text={title}
        order={order}
        search={search}
        setQuestionOrder={setQuestionOrder}
        clickTag={clickTag}
        handleAnswer={handleAnswer}
        handleNewQuestion={handleNewQuestion}
      />
    );
  };

  switch (page) {
    case "home": {
      content = getQuestionPage(questionOrder.toLowerCase(), search);
      break;
    }
    case "answer": {
      content = (
        <AnswerPage
          qid={qid}
          handleNewQuestion={handleNewQuestion}
          handleNewAnswer={handleNewAnswer}
        />
      );
      break;
    }
    case "newAnswer": {
      content = (
        <NewAnswer
          qid={qid}
          addAnswer={addAnswer}
          handleAnswer={handleAnswer}
        />
      );
      break;
    }
    case "newQuestion": {
      content = (
        <NewQuestion
          addQuestion={(question) => handleAddQuestion(question)}
        />
      );
      break;
    }
    case "tag": {
      content = (
          <TagPage
            getTagsWithQuestionNumber={getTagsWithQuestionNumber}
            clickTag={clickTag}
            handleNewQuestion={handleNewQuestion}
          />
      );
      break;
    }
    default:
      content = getQuestionPage(questionOrder.toLowerCase(), search);
      break;
  }

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={selected}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
      <div id="right_main" className="right_main">
        {content}
      </div>
    </div>
  );
};

export default Main;
