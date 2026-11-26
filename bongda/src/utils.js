import { TEAMS, POINTS, MAX_GOALS } from './data.js';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === Number(id));
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

// Bảng xếp hạng luôn có đủ 6 đội. Hàm thuần: không đụng vào state.
export const calcStandings = (matches) => {
  const rows = TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    diff: 0,
    points: 0,
  }));
  const byId = new Map(rows.map((r) => [r.id, r]));

  matches.forEach((m) => {
    const home = byId.get(m.home);
    const away = byId.get(m.away);
    if (!home || !away) return;
    home.played += 1;
    away.played += 1;
    home.gf += m.homeGoals;
    home.ga += m.awayGoals;
    away.gf += m.awayGoals;
    away.ga += m.homeGoals;
    const result = getResult(m);
    if (result === 'home') {
      home.won += 1;
      away.lost += 1;
      home.points += POINTS.win;
      away.points += POINTS.loss;
    } else if (result === 'away') {
      away.won += 1;
      home.lost += 1;
      away.points += POINTS.win;
      home.points += POINTS.loss;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += POINTS.draw;
      away.points += POINTS.draw;
    }
  });

  return rows
    .map((r) => ({ ...r, diff: r.gf - r.ga }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.diff - a.diff ||
        b.gf - a.gf ||
        a.name.localeCompare(b.name, 'vi')
    );
};

// { count, goals, average, counts: { home, draw, away } }
export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};

export const GOAL_HINT =
  'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';

// teamId, target, remaining có thể là chuỗi (lấy từ ô nhập)
export const calcNeeded = (standings, teamId, target, remaining) => {
  const team = standings.find((s) => String(s.id) === String(teamId));
  const isInt = (v) => /^\d+$/.test(String(v).trim());
  if (!team || !isInt(target) || !isInt(remaining) || Number(remaining) < 1) {
    return GOAL_HINT;
  }
  const need = Number(target) - team.points;
  const R = Number(remaining);
  if (need <= 0) return 'Đội đã đạt mục tiêu';
  if (need > POINTS.win * R) {
    return `Không thể đạt mục tiêu này (cần ${need} điểm nhưng ${R} trận chỉ tối đa ${POINTS.win * R})`;
  }
  const W = Math.max(0, Math.ceil((need - R) / 2));
  return `Cần thêm ${need} điểm ở ${R} trận còn lại, tối thiểu ${W} trận thắng`;
};