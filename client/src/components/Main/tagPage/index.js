import AskAQuestionButton from "../askAQuestionButton";
import "./index.css";
import Tag from "./tag";

const TagPage = ({
  tlist,
  getQuestionCountByTag,
  clickTag,
  handleNewQuestion,
}) => {
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
            getQuestionCountByTag={getQuestionCountByTag}
            clickTag={clickTag}
          />
        ))}
      </div>
    </>
  );
};

export default TagPage;
