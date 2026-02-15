
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CalendarCheck, 
  GraduationCap, 
  Wallet, 
  ClipboardList, 
  Bell,
  Settings
} from 'lucide-react';
import { UserRole, Teacher, LeaveRequest, Student } from './types';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.ACCOUNTANT] },
  { id: 'students', label: 'Students', icon: <Users size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER] },
  { id: 'teachers', label: 'Teachers', icon: <UserSquare2 size={20} />, roles: [UserRole.ADMIN] },
  { id: 'attendance', label: 'Attendance', icon: <CalendarCheck size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { id: 'exams', label: 'Exams & Results', icon: <GraduationCap size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { id: 'fees', label: 'Fee Management', icon: <Wallet size={20} />, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.STUDENT] },
  { id: 'routines', label: 'Routines', icon: <ClipboardList size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
  { id: 'notices', label: 'Notice Board', icon: <Bell size={20} />, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT] },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: [UserRole.ADMIN] },
];

export const MOCK_STUDENTS: Student[] = [
  { 
    id: '1', 
    studentId: 'STU-2024-001',
    name: 'Alex Johnson', 
    dob: '2008-05-12',
    gender: 'Male',
    bloodGroup: 'O+',
    religion: 'Christian',
    nationality: 'American',
    presentAddress: '123 Maple St, Springfield',
    permanentAddress: '123 Maple St, Springfield',
    fatherName: 'Mark Johnson',
    fatherPhone: '+1 555-0101',
    motherName: 'Elena Johnson',
    motherPhone: '+1 555-0102',
    guardianEmail: 'mark.j@example.com',
    rollNo: '101', 
    class: '10th', 
    section: 'A', 
    admissionDate: '2020-08-15',
    academicYear: '2023-2024',
    status: 'active',
    attendancePercentage: 92,
    totalFeesDue: 250,
    currentGpa: 3.8
  },
  { 
    id: '2', 
    studentId: 'STU-2024-002',
    name: 'Sarah Williams', 
    dob: '2009-02-28',
    gender: 'Female',
    bloodGroup: 'A-',
    religion: 'None',
    nationality: 'American',
    presentAddress: '456 Oak Lane, Springfield',
    fatherName: 'John Williams',
    fatherPhone: '+1 555-0201',
    motherName: 'Sarah Williams Sr.',
    motherPhone: '+1 555-0202',
    guardianEmail: 'williams.fam@example.com',
    rollNo: '102', 
    class: '10th', 
    section: 'A', 
    admissionDate: '2021-01-10',
    academicYear: '2023-2024',
    status: 'active',
    attendancePercentage: 88,
    totalFeesDue: 0,
    currentGpa: 3.5
  },
];

export const MOCK_TEACHERS: Teacher[] = [
  { 
    id: 't1', 
    employeeId: 'EMP001',
    name: 'Dr. Robert Fox', 
    subject: 'Mathematics', 
    email: 'robert.fox@school.edu', 
    phone: '+1 239 988 77', 
    gender: 'Male',
    dob: '1980-05-15',
    address: '123 Academic Way, Education City',
    specialization: 'Pure Mathematics',
    department: 'Science & Math',
    joiningDate: '2015-08-01',
    classes: ['10A', '10B', '9C'],
    qualification: 'Ph.D. in Pure Mathematics from Stanford University',
    status: 'active'
  },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    teacherId: 't1',
    teacherName: 'Dr. Robert Fox',
    leaveType: 'sick',
    startDate: '2023-10-20',
    endDate: '2023-10-22',
    reason: 'Severe flu.',
    status: 'approved',
    appliedAt: '2023-10-19'
  }
];

export const MOCK_FEES = [
  { id: 'f1', studentId: '1', feeType: 'Tuition Fee', amount: 500, paidAmount: 250, dueDate: '2023-11-15', status: 'Partial' },
  { id: 'f2', studentId: '2', feeType: 'Tuition Fee', amount: 500, paidAmount: 500, dueDate: '2023-11-15', status: 'Paid' },
];
