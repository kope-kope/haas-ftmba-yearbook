import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";

// Reference to the "students" collection
const studentsCollection = collection(db, "students");

// Function to add a new student profile
export const addStudentProfile = async (studentData) => {
  try {
    const docRef = await addDoc(studentsCollection, studentData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding student profile:", error);
    return { success: false, error };
  }
};

// Function to fetch all student profiles
export const getAllStudents = async () => {
  try {
    const querySnapshot = await getDocs(studentsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};

// Function to fetch a single student profile by ID
export const getStudentById = async (studentId) => {
  try {
    const docRef = doc(db, "students", studentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such student!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return null;
  }
};
