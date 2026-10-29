import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((prize, i) => {
      let cls = 'ladder-item';
      if (i === current) cls += ' ladder-active';
      if (MILESTONES.includes(i + 1)) cls += ' ladder-milestone';
      return (
        <li key={i} className={cls}>
          {`${i + 1}. ${formatMoney(prize)}`}
        </li>
      );
    }).reverse()}
  </ul>
);

export default MoneyLadder;