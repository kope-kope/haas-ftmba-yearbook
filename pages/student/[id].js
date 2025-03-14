import { useEffect, useState } from "react";
import { getStudentById } from "../../lib/firestore";
import { useRouter } from "next/router";

export default function StudentProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchStudent() {
        const data = await getStudentById(id);
        setStudent(data);
      }
      fetchStudent();
    }
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>{student.name}</h1>
      <img src={student.profilePicture} alt={student.name} style={{ width: "100%", borderRadius: "8px" }} />
      <p><strong>Industry:</strong> {student.industry}</p>
      <p><strong>Skills:</strong> {student.skills.join(", ")}</p>
      <p><strong>Interests:</strong> {student.interests.join(", ")}</p>
      <p><strong>Nationality:</strong> {student.nationality}</p>
      <p><strong>Favorite Memory:</strong> {student.favoriteMemory}</p>

      {student.spotifySong && (
        <iframe
          src={`https://open.spotify.com/embed/track/${student.spotifySong.split('/').pop()}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        ></iframe>
      )}

      {student.linkedin && (
        <p><a href={student.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>
      )}
    </div>
  );
}
