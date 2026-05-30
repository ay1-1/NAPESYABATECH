// Mock Data Service for NAPES Yabatech Portal

export interface Student {
  matricNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: "Civil" | "Mechanical" | "Electrical" | "Computer" | "Chemical" | "Industrial";
  level: "ND1" | "ND2" | "HND1" | "HND2";
  session: string;
  isPaid: boolean; // Retained for compatibility (represents overall cleared status)
  isFacultyPaid: boolean;
  isDeptPaid: boolean;
  password?: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  matricNumber: string;
  studentName: string;
  amount: number;
  purpose: string;
  reference: string;
  date: string;
  status: "success" | "pending" | "failed";
}

export interface Candidate {
  id: string;
  name: string;
  manifesto: string;
  votes: number;
  imageUrl?: string;
}

export interface ElectionPost {
  id: string;
  title: string; // e.g. President, Vice President
  candidates: Candidate[];
}

export interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "open" | "resolved";
}

export interface PastQuestion {
  id: string;
  title: string;
  courseCode: string;
  department: "Civil" | "Mechanical" | "Electrical" | "Computer" | "Chemical" | "Industrial" | "General";
  level: "ND1" | "ND2" | "HND1" | "HND2" | "All";
  fileUrl: string; // Simulated link
  createdAt: string;
}

// Initial mock data
const defaultStudents: Student[] = [
  {
    matricNumber: "F/HD/21/3210001",
    fullName: "Samson Beloved",
    email: "godisovergods@gmail.com",
    phone: "+234 812 345 6789",
    department: "Computer",
    level: "HND2",
    session: "2025/2026",
    isPaid: true,
    isFacultyPaid: true,
    isDeptPaid: true,
    password: "password",
    avatarUrl: ""
  },
  {
    matricNumber: "F/ND/22/3210002",
    fullName: "Jane Doe",
    email: "jane.doe@yabatech.edu.ng",
    phone: "+234 809 876 5432",
    department: "Electrical",
    level: "ND2",
    session: "2025/2026",
    isPaid: false,
    isFacultyPaid: false,
    isDeptPaid: false,
    password: "password",
    avatarUrl: ""
  },
  {
    matricNumber: "F/HD/22/3210003",
    fullName: "John Smith",
    email: "john.smith@yabatech.edu.ng",
    phone: "+234 901 234 5678",
    department: "Mechanical",
    level: "HND1",
    session: "2025/2026",
    isPaid: true,
    isFacultyPaid: true,
    isDeptPaid: true,
    password: "password",
    avatarUrl: ""
  },
  {
    matricNumber: "F/ND/23/3210004",
    fullName: "Alice Johnson",
    email: "alice.j@yabatech.edu.ng",
    phone: "+234 702 345 6789",
    department: "Civil",
    level: "ND1",
    session: "2025/2026",
    isPaid: false,
    isFacultyPaid: false,
    isDeptPaid: false,
    password: "password",
    avatarUrl: ""
  },
  {
    matricNumber: "F/HD/22/3210005",
    fullName: "David Alao",
    email: "david.alao@yabatech.edu.ng",
    phone: "+234 815 555 0199",
    department: "Chemical",
    level: "HND1",
    session: "2025/2026",
    isPaid: false,
    isFacultyPaid: false,
    isDeptPaid: false,
    password: "password",
    avatarUrl: ""
  }
];

const defaultTransactions: Transaction[] = [
  {
    id: "tx-001",
    matricNumber: "F/HD/21/3210001",
    studentName: "Samson Beloved",
    amount: 5000,
    purpose: "Faculty Dues",
    reference: "NP-739274",
    date: "2026-05-10T14:32:00Z",
    status: "success"
  },
  {
    id: "tx-002",
    matricNumber: "F/HD/21/3210001",
    studentName: "Samson Beloved",
    amount: 3000,
    purpose: "Departmental Dues",
    reference: "NP-739279",
    date: "2026-05-10T14:35:00Z",
    status: "success"
  },
  {
    id: "tx-003",
    matricNumber: "F/HD/22/3210003",
    studentName: "John Smith",
    amount: 5000,
    purpose: "Faculty Dues",
    reference: "NP-739275",
    date: "2026-05-12T09:15:00Z",
    status: "success"
  },
  {
    id: "tx-004",
    matricNumber: "F/HD/22/3210003",
    studentName: "John Smith",
    amount: 3000,
    purpose: "Departmental Dues",
    reference: "NP-739281",
    date: "2026-05-12T09:20:00Z",
    status: "success"
  }
];

const defaultElections: ElectionPost[] = [
  {
    id: "post-1",
    title: "President",
    candidates: [
      {
        id: "cand-1",
        name: "Comr. Olatunji Williams",
        manifesto: "Empowering engineering students through practical hands-on workshops and securing global tech partnerships.",
        votes: 142
      },
      {
        id: "cand-2",
        name: "Comr. Ibrahim Bello",
        manifesto: "Rebranding the Faculty of Engineering and upgrading laboratory infrastructure to modern specifications.",
        votes: 118
      }
    ]
  },
  {
    id: "post-2",
    title: "Vice President",
    candidates: [
      {
        id: "cand-3",
        name: "Comr. Chioma Nwachukwu",
        manifesto: "Expanding the HerEngineering Initiative and securing mentorship matching programs with top female engineering leaders.",
        votes: 165
      },
      {
        id: "cand-4",
        name: "Comr. Fatimah Yusuf",
        manifesto: "Improving academic peer-tutoring networks and standardizing access to past project drawing folders.",
        votes: 95
      }
    ]
  }
];

const defaultTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    email: "student1@yabatech.edu.ng",
    subject: "portal",
    message: "I am having difficulty updating my HND level in my profile biodata. It displays a save error.",
    date: "2026-05-24T10:00:00Z",
    status: "open"
  },
  {
    id: "ticket-2",
    email: "student2@yabatech.edu.ng",
    subject: "paystack",
    message: "My payment for the dues went through on Paystack but my portal account status is still showing clearance pending.",
    date: "2026-05-23T16:45:00Z",
    status: "open"
  }
];

const defaultPastQuestions: PastQuestion[] = [
  {
    id: "pq-001",
    title: "Algebra and Trigonometry",
    courseCode: "MTH 111",
    department: "Computer",
    level: "ND1",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-05-10T10:00:00Z"
  },
  {
    id: "pq-002",
    title: "Object Oriented Programming",
    courseCode: "COM 212",
    department: "Computer",
    level: "ND2",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-05-12T11:00:00Z"
  },
  {
    id: "pq-003",
    title: "Electrical Science I",
    courseCode: "EEC 115",
    department: "Electrical",
    level: "ND1",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-05-15T09:00:00Z"
  },
  {
    id: "pq-004",
    title: "Applied Mechanics",
    courseCode: "MEC 111",
    department: "Mechanical",
    level: "ND1",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    createdAt: "2026-05-18T14:00:00Z"
  }
];

// LocalStorage helpers
export const initLocalStorage = () => {
  if (!localStorage.getItem("napes_students")) {
    localStorage.setItem("napes_students", JSON.stringify(defaultStudents));
  }
  if (!localStorage.getItem("napes_transactions")) {
    localStorage.setItem("napes_transactions", JSON.stringify(defaultTransactions));
  }
  if (!localStorage.getItem("napes_elections")) {
    localStorage.setItem("napes_elections", JSON.stringify(defaultElections));
  }
  if (!localStorage.getItem("napes_tickets")) {
    localStorage.setItem("napes_tickets", JSON.stringify(defaultTickets));
  }
  if (!localStorage.getItem("napes_past_questions")) {
    localStorage.setItem("napes_past_questions", JSON.stringify(defaultPastQuestions));
  }
  if (!localStorage.getItem("napes_election_active")) {
    localStorage.setItem("napes_election_active", "true");
  }
};

export const getStudents = (): Student[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem("napes_students") || "[]");
};

export const saveStudents = (students: Student[]) => {
  localStorage.setItem("napes_students", JSON.stringify(students));
};

export const getTransactions = (): Transaction[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem("napes_transactions") || "[]");
};

export const saveTransactions = (txs: Transaction[]) => {
  localStorage.setItem("napes_transactions", JSON.stringify(txs));
};

export const getElections = (): ElectionPost[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem("napes_elections") || "[]");
};

export const saveElections = (posts: ElectionPost[]) => {
  localStorage.setItem("napes_elections", JSON.stringify(posts));
};

export const getTickets = (): SupportTicket[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem("napes_tickets") || "[]");
};

export const saveTickets = (tickets: SupportTicket[]) => {
  localStorage.setItem("napes_tickets", JSON.stringify(tickets));
};

export const getPastQuestions = (): PastQuestion[] => {
  initLocalStorage();
  return JSON.parse(localStorage.getItem("napes_past_questions") || "[]");
};

export const savePastQuestions = (pqs: PastQuestion[]) => {
  localStorage.setItem("napes_past_questions", JSON.stringify(pqs));
};

export const getElectionStatus = (): boolean => {
  initLocalStorage();
  return localStorage.getItem("napes_election_active") === "true";
};

export const saveElectionStatus = (active: boolean) => {
  localStorage.setItem("napes_election_active", active ? "true" : "false");
};
