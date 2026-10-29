import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ question, index, total, hidden, selected, status, onSelect }) => {
  const getState = (i) => {
    if (hidden.includes(i)) return 'hidden';
    if (status === 'answering') return 'normal';
    if (status === 'locked') return i === selected ? 'selected' : 'normal';
    // revealed
    if (i === question.answer) return 'correct';
    if (i === selected) return 'wrong';
    return 'normal';
  };

  return (
    <div className="question-card">
      <h3>{`Câu ${index + 1}/${total}`}</h3>
      <p className="question-text">{question.question}</p>
      <div className="answers">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={opt}
            state={getState(i)}
            disabled={status !== 'answering' || hidden.includes(i)}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;