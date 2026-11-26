import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUNDS, TEAMS, MAX_GOALS } from '../data';
import { addMatch, selectMatches } from '../features/matchesSlice';
import { useNotice } from '../context/NoticeContext';
import { getTeamName, isValidGoals } from '../utils';

const EMPTY = { round: '1', home: '', away: '', homeGoals: '', awayGoals: '' };
const GOALS_ERROR = `Số bàn thắng phải là số nguyên từ 0 đến ${MAX_GOALS}`;

const parseGoals = (s) => (/^\d+$/.test(s.trim()) ? Number(s) : NaN);

const AddMatchForm = () => {
  const dispatch = useDispatch();
  const matches = useSelector(selectMatches);
  const showNotice = useNotice();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    const home = Number(values.home);
    const away = Number(values.away);
    if (!values.home) errs.home = 'Hãy chọn đội nhà';
    if (!values.away) errs.away = 'Hãy chọn đội khách';
    if (values.home && values.away) {
      if (home === away) {
        errs.away = 'Hai đội phải khác nhau';
      } else if (
        matches.some(
          (m) =>
            (m.home === home && m.away === away) || (m.home === away && m.away === home)
        )
      ) {
        errs.away = 'Hai đội đã đá với nhau rồi';
      }
    }
    if (!isValidGoals(parseGoals(values.homeGoals))) errs.homeGoals = GOALS_ERROR;
    if (!isValidGoals(parseGoals(values.awayGoals))) errs.awayGoals = GOALS_ERROR;
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const home = Number(values.home);
    const away = Number(values.away);
    dispatch(
      addMatch({
        round: Number(values.round),
        home,
        away,
        homeGoals: Number(values.homeGoals),
        awayGoals: Number(values.awayGoals),
      })
    );
    showNotice(`Đã thêm trận ${getTeamName(home)} - ${getTeamName(away)}`);
    setValues(EMPTY);
    if (homeRef.current) homeRef.current.focus();
  };

  const teamOptions = (placeholder) => [
    <option key="empty" value="">
      {placeholder}
    </option>,
    ...TEAMS.map((t) => (
      <option key={t.id} value={t.id}>
        {t.name}
      </option>
    )),
  ];

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-round">Vòng</label>
        <select id="f-round" value={values.round} onChange={handleChange('round')}>
          {ROUNDS.map((r) => (
            <option key={r} value={r}>
              Vòng {r}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-home">Đội nhà</label>
        <select id="f-home" ref={homeRef} value={values.home} onChange={handleChange('home')}>
          {teamOptions('-- Chọn đội --')}
        </select>
        {errors.home && <p role="alert" className="error">{errors.home}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-away">Đội khách</label>
        <select id="f-away" value={values.away} onChange={handleChange('away')}>
          {teamOptions('-- Chọn đội --')}
        </select>
        {errors.away && <p role="alert" className="error">{errors.away}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-hg">Bàn thắng đội nhà</label>
        <input
          id="f-hg"
          type="number"
          value={values.homeGoals}
          onChange={handleChange('homeGoals')}
        />
        {errors.homeGoals && <p role="alert" className="error">{errors.homeGoals}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-ag">Bàn thắng đội khách</label>
        <input
          id="f-ag"
          type="number"
          value={values.awayGoals}
          onChange={handleChange('awayGoals')}
        />
        {errors.awayGoals && <p role="alert" className="error">{errors.awayGoals}</p>}
      </div>

      <button type="submit">Thêm trận</button>
    </form>
  );
};

export default AddMatchForm;