import "./index.css";

const Tag = ({ t, getQuestionCountByTag, clickTag }) => {
  return (
    <div
      className="tagNode"
      onClick={() => {
        clickTag(t.name);
      }}
    >
      <div className="tagName">{t.name}</div>
      <div>{getQuestionCountByTag(t.tid)} questions</div>
    </div>
  );
};

export default Tag;
