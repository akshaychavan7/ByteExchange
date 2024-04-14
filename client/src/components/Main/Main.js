import "./index.css";
import { useEffect, useState } from "react";
import SideBarNav from "./sideBarNav/Sidebar";
import QuestionPage from "./questionPage";
import AnswerPage from "./answerPage/AnwerPage";
import NewAnswer from "./newAnswer";
import NewQuestion from "./newQuestion";
import TagPage from "./tagPage/TagPage";
import { addQuestion } from "../../services/questionService";
import { addAnswer } from "../../services/answerService";
import { getTagsWithQuestionNumber } from "../../services/tagService";
import Users from "./Users/Users";
import getUsersList from "../../services/userService";
import { useAlert } from "../../context/AlertContext";

const Main = ({
  search = "",
  setSearch = () => {},
  title,
  setQuestionPage,
}) => {
  const alert = useAlert();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState("home");
  const [questionOrder, setQuestionOrder] = useState("newest");
  const [qid, setQid] = useState("");
  const [selected, setSelected] = useState("q");
  let content = null;

  useEffect(() => {
    async function fetchUsersList() {
      let res = await getUsersList();
      setUsers(res || []);
    }
    fetchUsersList().catch((e) => {
      console.error(e);
      alert.showAlert(
        "Could not fetch users list. Please contact admin if the issue persists.",
        "error"
      );
    });
  }, []);

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

  const handleUsers = () => {
    setSelected("u");
    setPage("user");
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

  const handleAddAnswer = async (qid, answer) => {
    await addAnswer(qid, answer);
    handleAnswer(qid);
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
          clickTag={clickTag}
          handleNewQuestion={handleNewQuestion}
          handleNewAnswer={handleNewAnswer}
        />
      );
      break;
    }
    case "newAnswer": {
      content = (
        <NewAnswer handleAddAnswer={(answer) => handleAddAnswer(qid, answer)} />
      );
      break;
    }
    case "newQuestion": {
      content = (
        <NewQuestion addQuestion={(question) => handleAddQuestion(question)} />
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
    case "user":
      content = <Users users={users} />;
      break;
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
        handleUsers={handleUsers}
        setQuestionPage={setQuestionPage}
      />
      <div id="right_main" className="right_main">
        {content}
      </div>
    </div>
  );
};

export default Main;
