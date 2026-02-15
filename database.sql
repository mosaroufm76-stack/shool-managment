
-- Smart School ERP: Complete Student Management Database Schema

CREATE DATABASE IF NOT EXISTS smart_school_erp;
USE smart_school_erp;

-- 1. Classes & Sections
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    section VARCHAR(10) NOT NULL,
    room_number VARCHAR(20),
    teacher_id INT
);

-- 2. Students Table (Comprehensive Profile)
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL, -- Auto-generated e.g., STU-2024-001
    full_name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'),
    religion VARCHAR(50),
    nationality VARCHAR(50) DEFAULT 'Citizen',
    present_address TEXT,
    permanent_address TEXT,
    
    -- Parent/Guardian Info
    father_name VARCHAR(100),
    father_phone VARCHAR(20),
    mother_name VARCHAR(100),
    mother_phone VARCHAR(20),
    guardian_email VARCHAR(100),
    
    -- Academic Context
    class_id INT,
    admission_date DATE,
    academic_year VARCHAR(20),
    profile_photo TEXT, -- URL/Base64
    status ENUM('Active', 'Inactive', 'Graduated', 'Suspended') DEFAULT 'Active',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 3. Student Documents
CREATE TABLE student_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    doc_type VARCHAR(50), -- Birth Certificate, Transfer Certificate, etc.
    file_path TEXT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 4. Attendance Management
CREATE TABLE student_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave', 'Late') NOT NULL,
    remarks TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY daily_att (student_id, date)
);

-- 5. Fee Management
CREATE TABLE student_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    fee_type VARCHAR(100), -- Tuition, Transport, Lab, Library
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    due_date DATE,
    status ENUM('Paid', 'Unpaid', 'Partial') DEFAULT 'Unpaid',
    payment_date DATE,
    transaction_id VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 6. Results & Exams (Relational Link)
CREATE TABLE student_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    exam_id INT,
    subject_id INT,
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(5),
    gpa DECIMAL(3,2),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX idx_student_name ON students(full_name);
CREATE INDEX idx_att_date ON student_attendance(date);
CREATE INDEX idx_fee_status ON student_fees(status);
