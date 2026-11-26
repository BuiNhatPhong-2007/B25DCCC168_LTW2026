import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUNDS, RESULT_LABELS } from './data';
import { calcMatchStats, calcStandings, getTeamName } from './utils';
import { hasSaved } from './store';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = 'B25DCCC168_LTW2026';
const BAR_UNIT = 24;

const App = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const { data, loading: fetching, error: fetchError } = useFetch('/data/matches.json');
  const [roundSetting, setRoundSetting] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  // Đã có dữ liệu lưu thì hiện trang ngay, không chờ (và không phụ thuộc) fetch
  const loading = hasSaved ? false : fetching;
  const error = hasSaved ? null : fetchError;

  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  const roundNumber = ROUNDS.includes(Number(roundSetting)) ? Number(roundSetting) : null;

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const leader = matches.length > 0 ? standings[0] : null;

  const roundMatches = useMemo(
    () => (roundNumber === null ? matches : matches.filter((m) => m.round === roundNumber)),
    [matches, roundNumber]
  );
  const stats = useMemo(() => calcMatchStats(roundMatches), [roundMatches]);

  const keyword = debouncedSearch.trim().toLowerCase();
  const visible = useMemo(
    () =>
      keyword === ''
        ? roundMatches
        : roundMatches.filter(
            (m) =>
              getTeamName(m.home).toLowerCase().includes(keyword) ||
              getTeamName(m.away).toLowerCase().includes(keyword)
          ),
    [roundMatches, keyword]
  );

  useEffect(() => {
    document.title = leader
      ? `${leader.name} dẫn đầu – Giải bóng đá khoa`
      : 'Giải bóng đá khoa';
  }, [leader]);

  const handleKey = useCallback((e) => {
    const input = searchRef.current;
    if (e.key === '/') {
      const el = document.activeElement;
      const tag = el ? el.tagName : '';
      const typing =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el && el.isContentEditable);
      if (!typing && input) {
        e.preventDefault();
        input.focus();
      }
    } else if (e.key === 'Escape' && input && document.activeElement === input) {
      setSearch('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleTeamShift = useCallback((e) => setSearch(e.target.value), []);

  const handleGoals = useCallback(
    (id, homeGoals, awayGoals) => dispatch(setGoals({ id, homeGoals, awayGoals })),
    [dispatch]
  );

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = useCallback(() => {
    if (!data) return;
    dispatch(setMatches(data.map((m) => ({ ...m }))));
    showNotice('Đã đặt lại dữ liệu mẫu');
  }, [data, dispatch, showNotice]);

  let content;
  if (loading) {
    content = <p>Đang tải lịch thi đấu…</p>;
  } else if (error) {
    content = <p role="alert" className="error">Không tải được lịch thi đấu</p>;
  } else {
    content = (
      <>
        <section>
          <h2>Bảng xếp hạng</h2>
          <StandingsTable standings={standings} />
        </section>

        <section>
          <h2>Thống kê</h2>
          <ul className="stats">
            <li>Số trận: {stats.count}</li>
            <li>Tổng số bàn thắng: {stats.goals}</li>
            <li>Bàn thắng mỗi trận: {stats.average.toFixed(2)}</li>
            <li>
              Đội dẫn đầu: {leader ? `${leader.name} (${leader.points} điểm)` : '—'}
            </li>
          </ul>
          <h3>Phân bố kết quả</h3>
          <ul className="distribution">
            {['home', 'draw', 'away'].map((key) => (
              <li key={key}>
                {RESULT_LABELS[key]}: {stats.counts[key]}
                <span className="bar" style={{ width: `${stats.counts[key] * BAR_UNIT}px` }} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Lịch thi đấu</h2>
          <div className="toolbar">
            <label>
              Xem vòng{' '}
              <select
                value={roundNumber === null ? 'all' : String(roundNumber)}
                onChange={(e) => setRoundSetting(e.target.value)}
              >
                <option value="all">Tất cả vòng</option>
                {ROUNDS.map((r) => (
                  <option key={r} value={r}>
                    Vòng {r}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tìm đội{' '}
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={handleTeamShift}
                placeholder="Nhấn / để tìm"
              />
            </label>
            {keyword !== '' && <span>Tìm thấy {visible.length} trận</span>}
          </div>

          {visible.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table className="schedule">
              <thead>
                <tr>
                  <th>Vòng</th>
                  <th>Đội nhà</th>
                  <th>BT nhà</th>
                  <th>BT khách</th>
                  <th>Đội khách</th>
                  <th>Kết quả</th>
                  <th>Số lần render</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((m) => (
                  <MatchRow key={m.id} match={m} onGoals={handleGoals} onRemove={handleRemove} />
                ))}
              </tbody>
            </table>
          )}
          <button type="button" className="reset" onClick={handleReset} disabled={!data}>
            Đặt lại dữ liệu mẫu
          </button>
        </section>

        <section>
          <h2>Thêm trận đấu</h2>
          <AddMatchForm />
        </section>

        <section>
          <h2>Mục tiêu điểm</h2>
          <GoalPlanner standings={standings} />
        </section>
      </>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header>
        <h1>Giải bóng đá khoa</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
        </button>
      </header>
      {content}
    </div>
  );
};

export default App;