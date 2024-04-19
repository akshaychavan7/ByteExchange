import "./index.css";
import { useEffect, useState } from "react";
import SideBarNav from "./sideBarNav/Sidebar";
import QuestionPage from "./questionPage";
import AnswerPage from "./answerPage/AnwerPage";
import NewAnswer from "./newAnswer";
import NewQuestion from "./newQuestion";
import TagPage from "./tagPage/TagPage";
import {
  addQuestion,
  getTrendingQuestions,
} from "../../services/questionService";
import { addAnswer } from "../../services/answerService";
import { getTagsWithQuestionNumber } from "../../services/tagService";
import Users from "./Users/Users";
import { getUsersList } from "../../services/userService";
import { useAlert } from "../../context/AlertContext";
import HomePage from "./HomePage/HomePage";

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
  const [selected, setSelected] = useState("h");
  const [qlist, setQlist] = useState([]);
  const [viewUserProfile, setViewUserProfile] = useState({
    view: false,
    username: "",
  });
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

    async function fetchTrendingQuestions() {
      let res = await getTrendingQuestions();
      setQlist(res || []);
    }
    fetchTrendingQuestions().catch((e) => {
      console.error(e);
      alert.showAlert(
        "Could not fetch trending questions. Please contact admin if the issue persists.",
        "error"
      );
    });
  }, [page]);

  const clickTag = (tagName) => {
    setSearch(`[${tagName}]`);
    setPage("question");
    setSelected("q");
  };
  const handleQuestions = () => {
    setSelected("q");
    setQuestionPage();
    setPage("questions");
  };

  const handleTags = () => {
    setSelected("t");
    setPage("tag");
  };

  const handleUsers = () => {
    setSelected("u");
    setPage("user");
  };

  const handleHomePage = () => {
    setSelected("h");
    setPage("home");
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
        setViewUserProfile={setViewUserProfile}
        setSelected={setSelected}
        handleUsers={handleUsers}
      />
    );
  };

  switch (page) {
    case "home": {
      content = (
        <HomePage
          title_text={title}
          order={questionOrder.toLowerCase()}
          search={search}
          setQuestionOrder={setQuestionOrder}
          clickTag={clickTag}
          handleAnswer={handleAnswer}
          handleNewQuestion={handleNewQuestion}
          qlist={qlist}
          setViewUserProfile={setViewUserProfile}
          setSelected={setSelected}
          handleUsers={handleUsers}
        />
      );
      break;
    }
    case "question": {
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
      content = (
        <Users
          users={users}
          viewUserProfile={viewUserProfile}
          setViewUserProfile={setViewUserProfile}
        />
      );
      break;
    default:
      content = getQuestionPage(questionOrder.toLowerCase(), search);
      break;
  }

  return (
    <div id="main" className="main">
      <SideBarNav
        selected={selected}
        setSelected={() => setSelected}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
        handleUsers={handleUsers}
        handleHomePage={handleHomePage}
        setQuestionPage={setQuestionPage}
        setViewUserProfile={setViewUserProfile}
      />
      <div id="right_main" className="right_main">
        {content}
      </div>
    </div>
  );
};

export default Main;
