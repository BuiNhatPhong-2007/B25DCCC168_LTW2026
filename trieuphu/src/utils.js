import { PRIZES, MILESTONES } from './data';

// reason: "wrong" | "timeout" | "quit" | "won"
export const calcPrize = (correctCount, reason) => {
  if (reason === 'quit' || reason === 'won') {
    return correctCount === 0 ? 0 : PRIZES[correctCount - 1];
  }
  // Sai hoặc hết giờ: chỉ nhận tiền của mốc cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  if (passed.length === 0) return 0;
  return PRIZES[Math.max(...passed) - 1];
};

// Chia % cho khán giả. Trả về mảng 4 số, tổng = 100.
export const splitAudience = (correctIndex, hidden) => {
  const correctPercent = 40 + Math.floor(Math.random() * 31); // 40..70
  let remain = 100 - correctPercent;
  const wrongs = [0, 1, 2, 3].filter(
    (i) => i !== correctIndex && !hidden.includes(i)
  );
  const result = [0, 0, 0, 0];
  result[correctIndex] = correctPercent;
  wrongs.forEach((idx, k) => {
    if (k === wrongs.length - 1) {
      result[idx] = remain;
    } else {
      const part = Math.floor(Math.random() * (remain + 1));
      result[idx] = part;
      remain -= part;
    }
  });
  return result;
};

// Chọn ngẫu nhiên 2 đáp án sai để ẩn (50:50)
export const pickTwoWrong = (correctIndex) => {
  const wrongs = [0, 1, 2, 3].filter((i) => i !== correctIndex);
  return [...wrongs].sort(() => Math.random() - 0.5).slice(0, 2);
};