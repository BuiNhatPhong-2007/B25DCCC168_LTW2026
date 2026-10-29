// state: "normal" | "selected" | "correct" | "wrong" | "hidden"
const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button
    className={`answer answer-${state}`}
    disabled={disabled}
    onClick={onClick}
  >
    {`${letter}. ${text}`}
  </button>
);

export default AnswerButton;