import { useState, useEffect } from "react";
import AskAQuestionButton from "../askAQuestionButton";
import "./index.css";
import Tag from "./tag";

const TagPage = ({
  getTagsWithQuestionNumber,
  clickTag,
  handleNewQuestion,
}) => {

  const [tlist, setTlist] = useState([]);
  useEffect(() => {
    getTagsWithQuestionNumber().then((res) => {
      setTlist(res);
    });
  }, []);

  return (
    <>
      <div className="space_between right_padding">
        <div className="bold_title">{tlist.length} Tags</div>
        <div className="bold_title">All Tags</div>

        <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
      </div>
      <div className="tag_list right_padding">
        {tlist.map((t, idx) => (
          <Tag
            key={idx}
            t={t}
            clickTag={clickTag}
          />
        ))}
      </div>
    </>
  );
};

export default TagPage;
