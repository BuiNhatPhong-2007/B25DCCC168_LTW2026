import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import { setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const dispatch = useDispatch();
  const { teamId, target, remaining } = useSelector((state) => state.goal);

  const message = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <div className="goal-planner">
      <div className="goal-fields">
        <label>
          Đội
          <select value={teamId} onChange={(e) => dispatch(setTeamId(e.target.value))}>
            <option value="">-- Chọn đội --</option>
            {TEAMS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Số điểm mục tiêu
          <input
            type="number"
            min="0"
            value={target}
            onChange={(e) => dispatch(setTarget(e.target.value))}
          />
        </label>
        <label>
          Số trận còn lại
          <input
            type="number"
            min="1"
            value={remaining}
            onChange={(e) => dispatch(setRemaining(e.target.value))}
          />
        </label>
      </div>
      <p className="goal-result">{message}</p>
    </div>
  );
};

export default GoalPlanner;