import { formatDiff } from '../data';

const StandingsTable = ({ standings }) => (
  <table className="standings">
    <thead>
      <tr>
        <th>Hạng</th>
        <th>Đội</th>
        <th>Trận</th>
        <th>Thắng</th>
        <th>Hòa</th>
        <th>Thua</th>
        <th>BT</th>
        <th>BB</th>
        <th>HS</th>
        <th>Điểm</th>
      </tr>
    </thead>
    <tbody>
      {standings.map((s, index) => (
        <tr key={s.id} className={index === standings.length - 1 ? 'last' : undefined}>
          <td>{index + 1}</td>
          <td>{s.name}</td>
          <td>{s.played}</td>
          <td>{s.won}</td>
          <td>{s.drawn}</td>
          <td>{s.lost}</td>
          <td>{s.gf}</td>
          <td>{s.ga}</td>
          <td>{formatDiff(s.diff)}</td>
          <td>{s.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default StandingsTable;