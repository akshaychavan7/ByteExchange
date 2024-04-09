import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";

const NewQuestion = ({ addQuestion }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const [titleErr, setTitleErr] = useState("");
  const [descriptionErr, setTextErr] = useState("");
  const [tagErr, setTagErr] = useState("");

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
    if (description.length === 0) {
      setTextErr("Question text cannot be empty");
      errFlag = true;
    }
    if (tags.length > 5) {
      setTagErr("Cannot have more than 5 tags");
      errFlag = true;
    }

    if (errFlag) return;

    let question = {
      title: title,
      description: description,
      tags: [...new Set(tags)],
    };

    addQuestion(question);
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
        val={description}
        setState={setDescription}
        err={descriptionErr}
      />
      <Input
        title={"Tags"}
        hint={"Add keywords separated by whitespace"}
        id={"formTagInput"}
        val={tag}
        setState={setTag}
        err={tagErr}
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
