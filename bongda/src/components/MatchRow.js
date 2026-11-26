import { memo, useRef } from 'react';
import { RESULT_LABELS, MAX_GOALS } from '../data';
import { getResult, getTeamName, isValidGoals } from '../utils';

const MatchRow = memo(({ match, onGoals, onRemove }) => {
  const renders = useRef(0);
  renders.current += 1;

  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);

  const handleHomeGoals = (e) => {
    const n = e.target.valueAsNumber;
    if (isValidGoals(n)) onGoals(match.id, n, match.awayGoals);
  };

  const handleAwayGoals = (e) => {
    const n = e.target.valueAsNumber;
    if (isValidGoals(n)) onGoals(match.id, match.homeGoals, n);
  };

  return (
    <tr className={result === 'draw' ? 'draw' : undefined}>
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <input
          type="number"
          min="0"
          max={MAX_GOALS}
          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          value={match.homeGoals}
          onChange={handleHomeGoals}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max={MAX_GOALS}
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          value={match.awayGoals}
          onChange={handleAwayGoals}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td className="renders">{renders.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default MatchRow;