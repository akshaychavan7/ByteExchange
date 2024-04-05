import "./index.css";

const OrderButton = ({ message, setQuestionOrder }) => {
  const camelize = function (str) {
    return str[0].toUpperCase() + str.substring(1, str.length);
  };
  return (
    <button className="btn" onClick={() => setQuestionOrder(message)}>
      {camelize(message)}
    </button>
  );
};

export default OrderButton;
