import "./index.css";

const Question = (props) => {
  return (
    <tr
      className="question right_padding lastActivity"
      onClick={() => props.handleAnswer(props.q.qid)}
    >
      <td className="question-info-grey postStats">
        <div>{props.q.getAnswerCount()} answers</div>
        <div>{props.q.getQuestionViews()} views</div>
      </td>
      <td className="title_td">
        <div className="question_mid postTitle">{props.q.title}</div>
        <div className="question_tags">
          {props.q.tagIds.map((tagID) => {
            return (
              <span className="question-tag question_tag_button" key={tagID}>
                {props.getTagById(tagID).name}
              </span>
            );
          })}
        </div>
      </td>
      <td className="question_author">
        <div>{props.q.askedBy}</div>
      </td>
      <td className="question_meta">
        {" asked " + props.q.calculateTimeElapsed()}
      </td>
    </tr>
  );
};

export default Question;
