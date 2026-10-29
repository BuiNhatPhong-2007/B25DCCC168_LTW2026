import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() === '') return;
    navigate('/play');
  };

  const best = history.reduce(
    (max, h) => (max === null || h.prize > max.prize ? h : max),
    null
  );

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      <ul>
        <li>15 câu hỏi trắc nghiệm, mỗi câu có 30 giây.</li>
        <li>Trả lời đúng thì leo lên bậc tiền thưởng tiếp theo, câu 15 trị giá 250.000.000 đ.</li>
        <li>Câu 5, 10, 15 là mốc an toàn: trả lời sai hoặc hết giờ chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
        <li>3 quyền trợ giúp: 50:50, Hỏi khán giả, Dừng cuộc chơi (mang tiền về).</li>
        <li>Phím tắt A, B, C, D để chọn đáp án.</li>
      </ul>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nhập tên người chơi"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button type="submit" disabled={playerName.trim() === ''}>
          Bắt đầu
        </button>
      </form>

      {best && (
        <p className="record">
          {`Kỷ lục: ${formatMoney(best.prize)} - ${best.name}`}
        </p>
      )}
    </div>
  );
};

export default Home;