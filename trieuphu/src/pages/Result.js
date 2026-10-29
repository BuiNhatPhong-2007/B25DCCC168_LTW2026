import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatMoney } from '../data';

const TITLES = {
  won: 'Chúc mừng! Bạn đã trở thành triệu phú!',
  wrong: 'Rất tiếc, bạn đã trả lời sai!',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

const Result = () => {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  const { name, reason, correctCount, prize } = state;

  return (
    <div>
      <h2>{TITLES[reason]}</h2>
      <p>{`Người chơi: ${name}`}</p>
      <p>{`Số câu trả lời đúng: ${correctCount}`}</p>
      <p>{`Tiền thưởng: ${formatMoney(prize)}`}</p>
      <div className="actions">
        <Link to="/play" className="btn">Chơi lại</Link>
        <Link to="/" className="btn">Về trang chủ</Link>
      </div>
    </div>
  );
};

export default Result;