
import React, { useState } from 'react';
// Added Eye to the list of lucide-react imports to fix the "Cannot find name 'Eye'" error
import { Search, GraduationCap, ClipboardList, TrendingUp, Download, CheckCircle2, AlertCircle, FileText, User, Star, MoreHorizontal, Sparkles, Printer, Lock, Eye } from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { Exam, ExamResult, SubjectMark } from '../types';
import { generateTeacherComment } from '../geminiService';

// Grading Logic Helper
const getGradeAndGpa = (marks: number) => {
  if (marks >= 80) return { grade: 'A+', gpa: 5.0 };
  if (marks >= 70) return { grade: 'A', gpa: 4.0 };
  if (marks >= 60) return { grade: 'A-', gpa: 3.5 };
  if (marks >= 50) return { grade: 'B', gpa: 3.0 };
  if (marks >= 40) return { grade: 'C', gpa: 2.0 };
  if (marks >= 33) return { grade: 'D', gpa: 1.0 };
  return { grade: 'F', gpa: 0.0 };
};

const ExamManagement: React.FC = () => {
  const [view, setView] = useState<'list' | 'entry' | 'report'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [isGeneratingComment, setIsGeneratingComment] = useState(false);

  const mockExams: Exam[] = [
    { id: 'ex1', name: 'Annual Examination', year: '2023-24', classId: '10th', status: 'draft', date: '2024-05-15' },
    { id: 'ex2', name: 'Mid-Term Assessment', year: '2023-24', classId: '10th', status: 'published', date: '2023-11-10' },
  ];

  const subjects = [
    { id: 's1', name: 'Mathematics', total: 100 },
    { id: 's2', name: 'English', total: 100 },
    { id: 's3', name: 'Science', total: 100 },
    { id: 's4', name: 'History', total: 100 },
  ];

  const handleStartEntry = (exam: Exam) => {
    setSelectedExam(exam);
    // Initialize results for all students in that class if empty
    const initialResults: ExamResult[] = MOCK_STUDENTS.filter(s => s.class === exam.classId).map(student => ({
      id: `res-${student.id}-${exam.id}`,
      studentId: student.id,
      studentName: student.name,
      examId: exam.id,
      totalMarks: 0,
      average: 0,
      gpa: 0,
      grade: 'F',
      subjectMarks: subjects.map(s => ({
        subjectId: s.id,
        subjectName: s.name,
        marksObtained: 0,
        totalMarks: s.total,
        grade: 'F',
        gpa: 0
      }))
    }));
    setResults(initialResults);
    setView('entry');
  };

  const updateMark = (resId: string, subId: string, val: string) => {
    const mark = parseInt(val) || 0;
    setResults(prev => prev.map(res => {
      if (res.id !== resId) return res;
      
      const newSubMarks = res.subjectMarks.map(sm => {
        if (sm.subjectId !== subId) return sm;
        const { grade, gpa } = getGradeAndGpa(mark);
        return { ...sm, marksObtained: mark, grade, gpa };
      });

      const total = newSubMarks.reduce((acc, curr) => acc + curr.marksObtained, 0);
      const avgGpa = parseFloat((newSubMarks.reduce((acc, curr) => acc + curr.gpa, 0) / subjects.length).toFixed(2));
      const overallGrade = getGradeAndGpa(total / subjects.length).grade;

      return { 
        ...res, 
        subjectMarks: newSubMarks, 
        totalMarks: total, 
        average: total / subjects.length,
        gpa: avgGpa,
        grade: overallGrade
      };
    }));
  };

  const handleViewReport = async (res: ExamResult) => {
    setSelectedResult(res);
    setView('report');
    if (!res.teacherComment) {
      setIsGeneratingComment(true);
      const comment = await generateTeacherComment(res.studentName, res.subjectMarks);
      setSelectedResult(prev => prev ? ({ ...prev, teacherComment: comment }) : null);
      setResults(prev => prev.map(r => r.id === res.id ? { ...r, teacherComment: comment } : r));
      setIsGeneratingComment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Result Management</h3>
          <p className="text-sm text-slate-500">
            {view === 'list' && 'Select an examination to manage marks'}
            {view === 'entry' && `Marks Entry: ${selectedExam?.name}`}
            {view === 'report' && 'Student Academic Report'}
          </p>
        </div>
        {view !== 'list' && (
          <button 
            onClick={() => setView('list')}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300 transition-all"
          >
            Back to Exams
          </button>
        )}
      </div>

      {/* Main Views */}
      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockExams.map(exam => (
            <div key={exam.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${exam.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <ClipboardList size={24} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  exam.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {exam.status}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{exam.name}</h4>
              <p className="text-sm text-slate-500 mb-4">Session: {exam.year} • Class: {exam.classId}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <AlertCircle size={14} /> Scheduled: {exam.date}
                </div>
                <button 
                  onClick={() => handleStartEntry(exam)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                >
                  Manage Marks
                </button>
              </div>
            </div>
          ))}
          
          <button className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
            <div className="p-3 bg-slate-50 rounded-full group-hover:bg-indigo-50">
              <GraduationCap size={24} />
            </div>
            <span className="font-bold text-sm">Create New Exam</span>
          </button>
        </div>
      )}

      {view === 'entry' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <FileText size={20} />
              </div>
              <h4 className="font-bold text-slate-900">Marks Entry Sheet</h4>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50">
                Export CSV
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center gap-2">
                <CheckCircle2 size={16} /> Save & Publish
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Student</th>
                  {subjects.map(s => (
                    <th key={s.id} className="px-4 py-4 text-center">{s.name} (100)</th>
                  ))}
                  <th className="px-4 py-4 text-center">GPA</th>
                  <th className="px-4 py-4 text-center">Grade</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {res.studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{res.studentName}</span>
                      </div>
                    </td>
                    {res.subjectMarks.map(sm => (
                      <td key={sm.subjectId} className="px-4 py-4">
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          value={sm.marksObtained}
                          onChange={(e) => updateMark(res.id, sm.subjectId, e.target.value)}
                          className="w-16 mx-auto block text-center py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-indigo-600">{res.gpa}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`font-bold text-xs px-2 py-1 rounded ${
                        res.grade === 'F' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {res.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewReport(res)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'report' && selectedResult && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 border border-slate-100">
          {/* Report Card Header */}
          <div className="p-8 bg-indigo-900 text-white relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">SMART ACADEMY ERP</h2>
                  <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase">Academic Progress Report</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Session</p>
                <p className="text-lg font-bold">2023 - 2024</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <div>
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">Student Name</p>
                <p className="font-bold text-sm">{selectedResult.studentName}</p>
              </div>
              <div>
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">Student ID</p>
                <p className="font-bold text-sm">ST-2023-00{selectedResult.studentId}</p>
              </div>
              <div>
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">Class / Section</p>
                <p className="font-bold text-sm">10th Grade / A</p>
              </div>
              <div>
                <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">Roll Number</p>
                <p className="font-bold text-sm">100{selectedResult.studentId}</p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="p-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Subject Name</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Full Marks</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Obtained</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Grade</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedResult.subjectMarks.map((sm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-800">{sm.subjectName}</td>
                    <td className="px-6 py-4 text-center text-slate-500">{sm.totalMarks}</td>
                    <td className="px-6 py-4 text-center font-bold text-indigo-600">{sm.marksObtained}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sm.grade === 'F' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        {sm.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-slate-700">{sm.gpa.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="px-6 py-4 rounded-bl-2xl">TOTAL AGGREGATE</td>
                  <td className="px-6 py-4 text-center">400</td>
                  <td className="px-6 py-4 text-center text-emerald-400">{selectedResult.totalMarks}</td>
                  <td className="px-6 py-4 text-center">{selectedResult.grade}</td>
                  <td className="px-6 py-4 text-center rounded-br-2xl">{selectedResult.gpa.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {/* AI Insights / Remarks */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Generated Remark</h4>
                </div>
                {isGeneratingComment ? (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></div>
                    <span className="text-xs font-medium text-amber-600">Generating professional remarks...</span>
                  </div>
                ) : (
                  <p className="text-slate-600 leading-relaxed italic bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                    "{selectedResult.teacherComment}"
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-end items-end space-y-8">
                <div className="text-center w-full max-w-[200px]">
                  <div className="h-px bg-slate-200 mb-2 w-full"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Class Teacher Signature</p>
                </div>
                <div className="text-center w-full max-w-[200px]">
                  <div className="h-px bg-slate-200 mb-2 w-full"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principal Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              <Lock size={12} /> Digital ID: {selectedResult.id}
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                <Printer size={16} /> Print Report
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
