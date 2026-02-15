
import React, { useState } from 'react';
import { MOCK_TEACHERS, MOCK_LEAVES } from '../constants';
import { Teacher, LeaveRequest } from '../types';
import { 
  Search, UserPlus, MoreHorizontal, Mail, Phone, BookOpen, Trash2, Edit2, 
  Eye, X, Briefcase, GraduationCap, Calendar, CheckCircle, XCircle, 
  Clock, MapPin, Sparkles, Filter, ShieldCheck, FileText, UserCheck, Users 
} from 'lucide-react';
import { analyzeTeacherWorkload } from '../geminiService';

const TeacherManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'attendance' | 'leaves'>('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Smart Analysis State
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSmartAnalysis = async (teacher: Teacher) => {
    setLoadingAnalysis(true);
    setAnalysis(null);
    const result = await analyzeTeacherWorkload(teacher);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const handleUpdateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
    
    if (status === 'approved') {
      const leave = leaveRequests.find(r => r.id === id);
      if (leave) {
        setTeachers(prev => prev.map(t => 
          t.id === leave.teacherId ? { ...t, status: 'on_leave' } : t
        ));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab('directory')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'directory' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          {/* Fix: Users icon is now properly imported from lucide-react */}
          <Users size={18} /> Faculty Directory
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <UserCheck size={18} /> Attendance Logs
        </button>
        <button 
          onClick={() => setActiveTab('leaves')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'leaves' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Clock size={18} /> Leave Requests
          {leaveRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
          )}
        </button>
      </div>

      {activeTab === 'directory' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Faculty Management</h3>
              <p className="text-sm text-slate-500">Manage teacher profiles and subject allocations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search faculty, ID or subject..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors"
              >
                <UserPlus size={18} /> Add Teacher
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Assigned Classes</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{teacher.name}</p>
                          <p className="text-xs text-slate-500">ID: {teacher.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <BookOpen size={14} className="text-indigo-500" />
                        <span className="font-medium">{teacher.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classes.map((cls, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        teacher.status === 'on_leave' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {teacher.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setViewingTeacher(teacher); setAnalysis(null); }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                        >
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'leaves' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Leave Management</h3>
            <p className="text-sm text-slate-500">Review and process faculty leave requests</p>
          </div>
          <div className="divide-y divide-slate-100">
            {leaveRequests.map((request) => (
              <div key={request.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {request.teacherName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{request.teacherName}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Calendar size={14} /> {request.startDate} to {request.endDate} 
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="capitalize">{request.leaveType} Leave</span>
                    </p>
                    <p className="text-sm text-slate-600 mt-2 bg-slate-100 p-3 rounded-xl italic">
                      "{request.reason}"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {request.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleUpdateLeaveStatus(request.id, 'rejected')}
                        className="px-4 py-2 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleUpdateLeaveStatus(request.id, 'approved')}
                        className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                    </>
                  ) : (
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase flex items-center gap-2 ${
                      request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {request.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {request.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 text-center">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <UserCheck size={40} className="text-slate-400" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Attendance Logger</h4>
            <p className="text-sm text-slate-500">Real-time teacher attendance tracking and biometric sync is active for this session.</p>
            <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Mark Today's Attendance
            </button>
          </div>
        </div>
      )}

      {/* Teacher Profile Modal */}
      {viewingTeacher && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="relative h-32 bg-indigo-600">
              <button 
                onClick={() => setViewingTeacher(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all z-10"
              >
                <X size={20} />
              </button>
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 rounded-2xl bg-emerald-100 border-4 border-white text-emerald-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                  {viewingTeacher.name.charAt(0)}
                </div>
              </div>
              <div className="absolute bottom-4 right-8 flex gap-2">
                <button 
                  onClick={() => handleSmartAnalysis(viewingTeacher)}
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} /> Smart Workload Analysis
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="pt-16 px-8 pb-8 overflow-y-auto max-h-[70vh]">
              {/* AI Analysis Result */}
              {analysis && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Gemini Workload Assessment</span>
                  </div>
                  <p className="text-sm text-amber-800 italic leading-relaxed">
                    "{analysis}"
                  </p>
                </div>
              )}
              {loadingAnalysis && (
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 animate-pulse">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI is assessing burnout risk...</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{viewingTeacher.name}</h2>
                  <p className="text-indigo-600 font-semibold">{viewingTeacher.subject} Instructor</p>
                  <p className="text-sm text-slate-500 font-medium">Employee ID: {viewingTeacher.employeeId}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                   <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Mail size={16} className="text-indigo-500" />
                    {viewingTeacher.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Phone size={16} className="text-indigo-500" />
                    {viewingTeacher.phone}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Section */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      <ShieldCheck size={18} className="text-indigo-600" />
                      Academic & Core Info
                    </h4>
                    <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Department</span>
                        <span className="font-bold text-slate-700">{viewingTeacher.department}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Specialization</span>
                        <span className="font-bold text-slate-700">{viewingTeacher.specialization}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Joining Date</span>
                        <span className="font-bold text-slate-700">{viewingTeacher.joiningDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Qualification</span>
                        <span className="font-bold text-indigo-600">{viewingTeacher.qualification}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      <BookOpen size={18} className="text-indigo-600" />
                      Assigned Workload
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingTeacher.classes.map((cls, i) => (
                        <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
                          Class {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      <MapPin size={18} className="text-indigo-600" />
                      Contact & Address
                    </h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed">
                      {viewingTeacher.address}
                    </p>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                      <FileText size={18} className="text-indigo-600" />
                      Documents
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 border border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                        <FileText size={24} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resume.pdf</span>
                      </button>
                      <button className="p-4 border border-slate-200 rounded-2xl flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                        <ShieldCheck size={24} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contract.docx</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Last Profile Update: 2 days ago
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setViewingTeacher(null)}
                  className="px-6 py-2.5 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                  Update Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
