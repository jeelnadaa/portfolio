export interface EducationRecord {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  grade: string;
  coursework: string[];
}

export const educationRecords: EducationRecord[] = [
  {
    degree: "Bachelor of Technology in Computer Science",
    institution: "PES University",
    location: "Bengaluru, India",
    duration: "Aug. 2023 — Present (Expected 2027)",
    grade: "CGPA: 8.43 / 10.0",
    coursework: [
      "Data Structures and Algorithms",
      "Object-Oriented Programming",
      "Web Technologies",
      "Database Management Systems",
      "Distributed Systems",
      "Computer Networks",
      "System Design & Concurrency",
    ],
  },
];
