import { useState, useEffect } from "react";
import { addStudentProfile } from "../lib/firestore";
import { auth, googleProvider } from "../lib/firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function AddStudent() {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    profilePicture: "",
    industry: "",
    interests: "",
    skills: "",
    nationality: "",
    favoriteMemory: "",
    spotifySong: "",
    linkedin: "",
  });

  const [status, setStatus] = useState("");

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;
  
      if (!userEmail.endsWith("@berkeley.edu")) {
        alert("Access restricted to Haas students. Please use your Berkeley email.");
        await signOut(auth);
        return;
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  
  // Sign out
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Handle form input change
  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...student,
      interests: student.interests.split(",").map((i) => i.trim()),
      skills: student.skills.split(",").map((s) => s.trim()),
      addedBy: user.email, // Store who added the student
    };

    const response = await addStudentProfile(formattedData);

    if (response.success) {
      setStatus("Student added successfully!");
      setStudent({
        name: "",
        profilePicture: "",
        industry: "",
        interests: "",
        skills: "",
        nationality: "",
        favoriteMemory: "",
        spotifySong: "",
        linkedin: "",
      });
    } else {
      setStatus("Error adding student.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Add Student Profile</h1>
      {!user ? (
        <>
          <p>Please log in with your Haas email to access this page.</p>
          <button onClick={handleLogin}>Login with Google</button>
        </>
      ) : (
        <>
          <p>Signed in as {user.displayName} ({user.email})</p>
          <button onClick={handleLogout}>Logout</button>
          {status && <p>{status}</p>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Full Name" value={student.name} onChange={handleChange} required />
            <input type="url" name="profilePicture" placeholder="Profile Picture URL" value={student.profilePicture} onChange={handleChange} required />
            <input type="text" name="industry" placeholder="Industry" value={student.industry} onChange={handleChange} required />
            <input type="text" name="interests" placeholder="Interests (comma-separated)" value={student.interests} onChange={handleChange} required />
            <input type="text" name="skills" placeholder="Skills (comma-separated)" value={student.skills} onChange={handleChange} required />
            <input type="text" name="nationality" placeholder="Nationality" value={student.nationality} onChange={handleChange} required />
            <textarea name="favoriteMemory" placeholder="Favorite Berkeley Haas Memory" value={student.favoriteMemory} onChange={handleChange} required />
            <input type="url" name="spotifySong" placeholder="Spotify Song URL" value={student.spotifySong} onChange={handleChange} />
            <input type="url" name="linkedin" placeholder="LinkedIn URL (optional)" value={student.linkedin} onChange={handleChange} />
            <button type="submit">Add Student</button>
          </form>
        </>
      )}
    </div>
  );
}
