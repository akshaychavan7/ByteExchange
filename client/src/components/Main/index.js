import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import AnswerPage from "./answerPage";
import NewAnswer from "./newAnswer";
import NewQuestion from "./newQuestion";
import TagPage from "./tagPage";
import { addQuestion } from "../../services/questionService";

const Main = ({
  search = "",
  setSearch = () => {},
  app,
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
      // setSelected("q");
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
      // setSelected("");
      content = (
        <NewAnswer
          qid={qid}
          addAnswer={app.addAnswer}
          handleAnswer={handleAnswer}
        />
      );
      break;
    }
    case "newQuestion": {
      // setSelected("");
      content = (
        <NewQuestion
          addQuestion={(question) => addQuestion(question)}
          handleQuestions={handleQuestions}
        />
      );
      break;
    }
    case "tag": {
      content = (
        <TagPage
          tlist={app.getTags()}
          getQuestionCountByTag={app.getQuestionCountByTag}
          clickTag={clickTag}
          handleNewQuestion={handleNewQuestion}
        />
      );
      break;
    }
    default:
      content = <QuestionPage app={app} />;
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
