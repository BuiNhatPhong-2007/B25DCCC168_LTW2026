import { useState } from "react";
 
const initialStudents = [
  { id: 1, name: "Nguyễn Văn An", score: 8.5, className: "D25CQCN01" },
  { id: 2, name: "Trần Thị Bình", score: 6.0, className: "D25CQCN01" },
  { id: 3, name: "Lê Minh Châu", score: 4.0, className: "D25CQCN02" },
  { id: 4, name: "Phạm Quốc Dũng", score: 9.0, className: "D25CQCN02" },
];
 
const cell = { padding: "8px", borderBottom: "1px solid #ddd", textAlign: "left" };
 
// Component cháu: một dòng sinh viên
const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, className } = student;
  const rank = score >= 8 ? "Giỏi" : score < 5 ? "Trượt" : "Đạt";
 
  return (
    <tr>
      <td style={cell}>{id}</td>
      <td style={cell}>{name}</td>
      <td style={cell}>{className}</td>
      <td style={cell}>{score.toFixed(1)}</td>
      <td style={cell}>{rank}</td>
      <td style={cell}>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};
 
// Component con: nhận danh sách qua props
const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p>Không có sinh viên nào phù hợp.</p>;
  }
 
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={cell}>ID</th>
          <th style={cell}>Họ tên</th>
          <th style={cell}>Lớp</th>
          <th style={cell}>Điểm</th>
          <th style={cell}>Xếp loại</th>
          <th style={cell}></th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};
 
// Component cha: quản lý state
const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all"); // all | good | fail
  const [form, setForm] = useState({ name: "", score: "", className: "" });
  const [error, setError] = useState("");
 
  const { name, score, className } = form;
 
  const handleChange = ({ target: { name: field, value } }) =>
    setForm((prev) => ({ ...prev, [field]: value }));
 
  const handleAdd = () => {
    const scoreNum = Number(score);
 
    if (!name.trim() || score === "" || !className.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên, điểm số và lớp.");
      return;
    }
    if (Number.isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số phải nằm trong khoảng từ 0 đến 10.");
      return;
    }
 
    const nextId = students.reduce((max, { id }) => Math.max(max, id), 0) + 1;
    setStudents((prev) => [
      ...prev,
      { id: nextId, name: name.trim(), score: scoreNum, className: className.trim() },
    ]);
    setForm({ name: "", score: "", className: "" });
    setError("");
  };
 
  const handleDelete = (id) =>
    setStudents((prev) => prev.filter((s) => s.id !== id));
 
  const filtered = students.filter(({ score }) =>
    filter === "good" ? score >= 8 : filter === "fail" ? score < 5 : true
  );
 
  const total = students.length;
  const average = total
    ? students.reduce((sum, { score }) => sum + score, 0) / total
    : 0;
 
  const filters = [
    { key: "all", label: "Tất cả" },
    { key: "good", label: "Giỏi (>= 8)" },
    { key: "fail", label: "Trượt (< 5)" },
  ];
 
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Quản lý Điểm Sinh viên</h1>
 
      <p>{`Tổng số sinh viên: ${total}`}</p>
      <p>{`Điểm trung bình cả lớp: ${average.toFixed(2)}`}</p>
 
      <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
        <input name="name" value={name} onChange={handleChange} placeholder="Họ tên" />
        <input name="score" type="number" step="0.1" value={score} onChange={handleChange} placeholder="Điểm số" />
        <input name="className" value={className} onChange={handleChange} placeholder="Lớp" />
        <button onClick={handleAdd}>Thêm</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
 
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ fontWeight: filter === key ? "bold" : "normal" }}
          >
            {label}
          </button>
        ))}
      </div>
 
      <StudentList students={filtered} onDelete={handleDelete} />
    </div>
  );
};
 
export default App;
 