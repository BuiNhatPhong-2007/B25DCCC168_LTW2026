import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    {percents.map((p, i) => (
      <div key={i} className="audience-col">
        <div className="bar-wrap">
          <div className="bar" style={{ height: `${p}%` }} />
        </div>
        <span>{`${LETTERS[i]}: ${p}%`}</span>
      </div>
    ))}
  </div>
);

export default AudienceChart;