import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";

const NewQuestion = ({ addQuestion, handleQuestions }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [usrn, setUsrn] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [textErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");
  const [usrnErr, setUsrnErr] = useState("");

  const postQuestion = () => {
    let errFlag = false;
    if (tag.length === 0) {
      setTagErr("Should have at least 1 tag");
      errFlag = true;
    }
    let tags = tag.split(" ").filter((tag) => {
      if (tag.trim().length > 20) {
        setTagErr("New tag length cannot be more than 20");
        errFlag = true;
      }
      return tag.trim() !== "";
    });

    if (title.length === 0) {
      setTitleErr("Title cannot be empty");
      errFlag = true;
    }
    if (title.length > 100) {
      setTitleErr("Title cannot be more than 100 characters");
      errFlag = true;
    }
    if (text.length === 0) {
      setTextErr("Question text cannot be empty");
      errFlag = true;
    }
    if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      errFlag = true;
    }
    if (usrn.length === 0) {
      setUsrnErr("Username cannot be empty");
      errFlag = true;
    }

    if (errFlag) return;

    let question = {
      title: title,
      text: text,
      tags: [...new Set(tags)],
      askedBy: usrn,
    };

    addQuestion(question);
    handleQuestions();
  };

  return (
    <Form>
      <Input
        title={"Question Title"}
        hint={"Limit title to 100 characters or less"}
        id={"formTitleInput"}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={"Question Text"}
        hint={"Add details"}
        id={"formTextInput"}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
      />
      <Input
        title={"Username"}
        id={"formUsernameInput"}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <div className="btn_indicator_container">
        <button
          className="form_postBtn"
          onClick={() => {
            postQuestion();
          }}
        >
          Post Question
        </button>
        <div className="mandatory_indicator">* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestion;
