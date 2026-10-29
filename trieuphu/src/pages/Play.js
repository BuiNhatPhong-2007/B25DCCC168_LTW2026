import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, splitAudience, pickTwoWrong } from '../utils';

const Game = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); // answering | locked | revealed
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [timedOut, setTimedOut] = useState(false);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false });

  const total = questions.length;
  const question = questions[index];
  const isCorrect = selected === question.answer;

  const finish = (reason, correctCount) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({ name: playerName, prize, correctCount });
    navigate('/result', {
      replace: true,
      state: { name: playerName, reason, correctCount, prize },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ 30 giây (chạy khi đang answering)
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  // Hết giờ = trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) {
      setTimedOut(true);
      setSelected(null);
      setStatus('locked');
    }
  }, [timeLeft, status]);

  // Các bước chờ: 1 giây lộ kết quả, 2 giây sang câu
  useEffect(() => {
    if (status === 'locked') {
      const t = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(t);
    }
    if (status === 'revealed') {
      const t = setTimeout(() => {
        if (isCorrect) {
          if (index === total - 1) {
            finish('won', total);
          } else {
            setIndex((i) => i + 1);
            setStatus('answering');
            setSelected(null);
            setTimeLeft(TIME_PER_QUESTION);
            setTimedOut(false);
            setHidden([]);
            setAudience(null);
          }
        } else {
          finish(timedOut ? 'timeout' : 'wrong', index);
        }
      }, 2000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Phím tắt A-D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.length !== 1) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i === -1) return;
      handleSelect(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} - ${playerName}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, total, playerName]);

  const handleFifty = () => {
    const newHidden = pickTwoWrong(question.answer);
    setHidden(newHidden);
    setUsed((prev) => ({ ...prev, fifty: true }));
    if (audience) setAudience(splitAudience(question.answer, newHidden));
  };

  const handleAudience = () => {
    setAudience(splitAudience(question.answer, hidden));
    setUsed((prev) => ({ ...prev, audience: true }));
  };

  const handleQuit = () => finish('quit', index);

  return (
    <div className="play">
      <div className="play-main">
        <Timer timeLeft={timeLeft} />
        <QuestionCard
          key={index}
          question={question}
          index={index}
          total={total}
          hidden={hidden}
          selected={selected}
          status={status}
          onSelect={handleSelect}
        />
        <Lifelines
          used={used}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onQuit={handleQuit}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index} />
    </div>
  );
};

const Play = ({ questions, loading, error, playerName, onFinish }) => {
  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p>Đang tải câu hỏi...</p>;
  if (error) return <p>{error}</p>;
  if (questions.length === 0) return <p>Chưa có câu hỏi nào.</p>;
  return (
    <Game questions={questions} playerName={playerName} onFinish={onFinish} />
  );
};

export default Play;