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
    degree: "B.Tech in Computer Science and Engineering",
    institution: "PES University",
    location: "Bengaluru, India",
    duration: "2023 — 2027 (Expected)",
    grade: "CGPA: 8.43 / 10.0",
    coursework: [
      "Data Structures & Applications",
      "Analysis and Design of Algorithms",
      "Operating Systems & Systems Programming",
      "Computer Organization & Architecture",
      "Database Management Systems",
      "Computer Networks",
      "Linear Algebra & Multivariable Calculus",
    ],
  },
];
