import { TIME_PER_QUESTION } from '../data';

const Timer = ({ timeLeft }) => {
  const percent = Math.max(0, (timeLeft / TIME_PER_QUESTION) * 100);

  return (
    <div className={timeLeft <= 15 ? 'timer timer-low' : 'timer'}>
      <span className="timer-text">{`Còn ${timeLeft} giây`}</span>
      <div className="timer-track">
        <div className="timer-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default Timer;