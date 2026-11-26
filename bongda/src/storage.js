const MATCHES_KEY = 'ltw_bongda_matches';

// Trả về mảng đã lưu, hoặc null nếu chưa có dữ liệu (hay dữ liệu hỏng)
export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(MATCHES_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (err) {
    // localStorage đầy hoặc bị chặn: bỏ qua
  }
};