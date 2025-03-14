import { useEffect, useState } from "react";
import { getAllStudents } from "../lib/firestore";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      const data = await getAllStudents();
      setStudents(data);
    }
    fetchStudents();
  }, []);

  // Filter students based on search and industry
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterIndustry === "" || student.industry === filterIndustry)
  );

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h1>FTMBA '26 Yearbook</h1>
      
      {/* Search & Filter */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)}>
        <option value="">All Industries</option>
        {Array.from(new Set(students.map(s => s.industry))).map((industry) => (
          <option key={industry} value={industry}>{industry}</option>
        ))}
      </select>

      {/* Student Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {filteredStudents.map((student) => (
          <div key={student.id} style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center", borderRadius: "8px" }}>
            <img src={student.profilePicture} alt={student.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }} />
            <h3>{student.name}</h3>
            <p>{student.industry}</p>
            <a href={`/student/${student.id}`} style={{ textDecoration: "none", color: "blue" }}>View Profile</a>
          </div>
        ))}
      </div>
    </div>
  );
}
