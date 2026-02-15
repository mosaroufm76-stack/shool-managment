
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ACCOUNTANT = 'ACCOUNTANT'
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  religion?: string;
  nationality?: string;
  presentAddress: string;
  permanentAddress?: string;
  
  // Parent Info
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  guardianEmail: string;

  // Academic info
  rollNo: string;
  class: string;
  section: string;
  admissionDate: string;
  academicYear: string;
  status: 'active' | 'inactive' | 'graduated';
  profilePhoto?: string;
  
  // Stats
  attendancePercentage?: number;
  totalFeesDue?: number;
  currentGpa?: number;
}

export interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  specialization: string;
  department: string;
  joiningDate: string;
  classes: string[];
  qualification?: string;
  status: 'active' | 'on_leave' | 'retired';
  employmentHistory?: {
    role: string;
    organization: string;
    period: string;
  }[];
}

export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  leaveType: 'sick' | 'casual' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

// Added SubjectMark interface
export interface SubjectMark {
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  gpa: number;
}

// Added Exam interface
export interface Exam {
  id: string;
  name: string;
  year: string;
  classId: string;
  status: 'draft' | 'published';
  date: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  totalMarks: number;
  average: number;
  gpa: number;
  grade: string;
  // Updated to use SubjectMark interface
  subjectMarks: SubjectMark[];
  teacherComment?: string;
}
