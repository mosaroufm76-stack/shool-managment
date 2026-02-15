
import React, { useState } from 'react';
import { MOCK_STUDENTS, MOCK_FEES } from '../constants';
import { Student } from '../types';
import { 
  Search, UserPlus, MoreHorizontal, Sparkles, X, User, Hash, GraduationCap, 
  Users, Phone, Zap, Loader2, Eye, ShieldCheck, Mail, Calendar, MapPin, 
  Droplets, Heart, FileText, Download, Wallet, TrendingUp, AlertCircle,
  UserCheck // Added UserCheck to imports
} from 'lucide-react';
import { 
  getStudentPerformanceInsight, 
  parseStudentAdmission, 
  getPredictiveAnalysis,
  generateParentUpdate
} from '../geminiService';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals & Active State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSmartAdmissionOpen, setIsSmartAdmissionOpen] = useState(false);
  
  // AI Feature States
  const [aiAnalysis, setAiAnalysis] = useState<{
    insight: string | null;
    prediction: string | null;
    parentNote: string | null;
  }>({ insight: null, prediction: null, parentNote: null });
  const [loadingAi, setLoadingAi] = useState(false);

  // Form State
  const [smartPrompt, setSmartPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenProfile = async (student: Student) => {
    setSelectedStudent(student);
    setAiAnalysis({ insight: null, prediction: null, parentNote: null });
    setLoadingAi(true);
    
    // Concurrently fetch AI insights
    const [insight, prediction] = await Promise.all([
      getStudentPerformanceInsight(student),
      getPredictiveAnalysis(student, student.attendancePercentage || 0, [])
    ]);

    setAiAnalysis({ ...aiAnalysis, insight, prediction });
    setLoadingAi(false);
  };

  const handleGenerateParentUpdate = async () => {
    if (!selectedStudent || !aiAnalysis.insight) return;
    setLoadingAi(true);
    const note = await generateParentUpdate(selectedStudent, aiAnalysis.insight);
    setAiAnalysis(prev => ({ ...prev, parentNote: note }));
    setLoadingAi(false);
  };

  const handleSmartAdmission = async () => {
    if (!smartPrompt.trim()) return;
    setIsParsing(true);
    try {
      const parsedData = await parseStudentAdmission(smartPrompt);
      // In a real app, we'd open the manual form pre-filled
      alert(`AI Extracted: ${parsedData.name}. In a production environment, this would pre-fill the manual form.`);
      setIsSmartAdmissionOpen(false);
    } catch (error) {
      alert("AI extraction failed.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or Student ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsSmartAdmissionOpen(true)}
            className="flex-1 md:flex-none bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 border border-amber-200 flex items-center justify-center gap-2 transition-all"
          >
            <Zap size={18} /> Smart Admission
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Current Class</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Fee Status</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">{student.class} - {student.section}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-20 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            (student.attendancePercentage || 0) > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${student.attendancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{student.attendancePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      student.totalFeesDue === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {student.totalFeesDue === 0 ? 'Clear' : `$${student.totalFeesDue} Pending`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-indigo-600">{student.currentGpa}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenProfile(student)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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

      {/* Student Profile Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-5xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 p-8 text-white flex items-center justify-between relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-24 h-24 rounded-3xl bg-indigo-600 border-4 border-white/10 flex items-center justify-center text-4xl font-bold shadow-2xl">
                    {selectedStudent.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold mb-1">{selectedStudent.name}</h2>
                    <div className="flex items-center gap-4 text-indigo-200 text-sm font-medium">
                      <span className="bg-white/10 px-3 py-1 rounded-full">{selectedStudent.studentId}</span>
                      <span className="flex items-center gap-1"><GraduationCap size={16} /> Class {selectedStudent.class}-{selectedStudent.section}</span>
                      <span className="flex items-center gap-1"><Calendar size={16} /> Joined: {selectedStudent.admissionDate}</span>
                    </div>
                 </div>
               </div>
               <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all z-10"
               >
                 <X size={24} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Bio & Info */}
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={14} /> Personal Information
                      </h4>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Gender</span>
                            <span className="text-sm font-bold text-slate-700">{selectedStudent.gender}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">DOB</span>
                            <span className="text-sm font-bold text-slate-700">{selectedStudent.dob}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">Blood Group</span>
                            <span className="flex items-center gap-1 text-sm font-bold text-rose-600"><Droplets size={14} /> {selectedStudent.bloodGroup}</span>
                         </div>
                         <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                            <span className="text-sm text-slate-500">Religion</span>
                            <span className="text-sm font-bold text-slate-700">{selectedStudent.religion}</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users size={14} /> Family & Guardian
                      </h4>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Father's Name</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.fatherName}</p>
                            <p className="text-xs text-indigo-600 font-medium">{selectedStudent.fatherPhone}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Mother's Name</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.motherName}</p>
                         </div>
                         <div className="pt-2 border-t border-slate-50 flex items-center gap-2 text-slate-600">
                            <Mail size={14} className="text-indigo-400" />
                            <span className="text-xs font-medium truncate">{selectedStudent.guardianEmail}</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Present Address
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed italic">{selectedStudent.presentAddress}</p>
                   </div>
                </div>

                {/* Middle Column: Performance & AI */}
                <div className="lg:col-span-2 space-y-6">
                   {/* Stat Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-indigo-600 p-5 rounded-3xl text-white shadow-lg shadow-indigo-100">
                         <div className="flex items-center justify-between mb-2">
                            <TrendingUp size={20} className="text-indigo-200" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Current GPA</span>
                         </div>
                         <h3 className="text-3xl font-bold">{selectedStudent.currentGpa}</h3>
                         <p className="text-xs text-indigo-200 mt-1">Class Rank: Top 5%</p>
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                         <div className="flex items-center justify-between mb-2">
                            <UserCheck size={20} className="text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Attendance</span>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900">{selectedStudent.attendancePercentage}%</h3>
                         <p className="text-xs text-emerald-500 mt-1">Excellent consistency</p>
                      </div>
                      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                         <div className="flex items-center justify-between mb-2">
                            <Wallet size={20} className={`text-${selectedStudent.totalFeesDue === 0 ? 'emerald-500' : 'rose-500'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fee Balance</span>
                         </div>
                         <h3 className="text-3xl font-bold text-slate-900">${selectedStudent.totalFeesDue}</h3>
                         <p className={`text-xs mt-1 ${selectedStudent.totalFeesDue === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {selectedStudent.totalFeesDue === 0 ? 'Fully Paid' : 'Action Required'}
                         </p>
                      </div>
                   </div>

                   {/* AI Predictive Insight */}
                   <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles size={100} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                              <Zap size={16} />
                           </div>
                           <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Gemini Predictive Analysis</h4>
                        </div>
                        
                        {loadingAi ? (
                          <div className="flex items-center gap-3 py-4">
                             <Loader2 size={24} className="animate-spin text-indigo-600" />
                             <p className="text-sm text-indigo-600 font-medium animate-pulse">Consulting educational prediction engine...</p>
                          </div>
                        ) : (
                          <>
                             <p className="text-indigo-800 leading-relaxed font-medium mb-4">
                               "{aiAnalysis.prediction || 'Analysis pending...'}"
                             </p>
                             <div className="flex flex-wrap gap-2">
                                <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm flex items-center gap-1">
                                   <Heart size={10} /> Personalized Plan Ready
                                </span>
                                <span className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-100 shadow-sm flex items-center gap-1">
                                   <TrendingUp size={10} /> High Graduation Likelihood
                                </span>
                             </div>
                          </>
                        )}
                      </div>
                   </div>

                   {/* Parent Update Tool */}
                   <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
                              <Users size={16} />
                           </div>
                           <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest">Parent Update Generator</h4>
                        </div>
                        <button 
                          onClick={handleGenerateParentUpdate}
                          disabled={loadingAi}
                          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          Generate New Update
                        </button>
                      </div>
                      
                      {aiAnalysis.parentNote ? (
                        <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-emerald-800 text-sm leading-relaxed italic shadow-sm">
                           "{aiAnalysis.parentNote}"
                           <div className="mt-4 flex gap-2">
                              <button className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-widest">Send SMS</button>
                              <button className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-widest">Send Email</button>
                           </div>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600 font-medium italic">Generate a professional update based on the AI analysis above to keep parents informed.</p>
                      )}
                   </div>

                   {/* Documents & Files */}
                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <FileText size={14} /> Student Documents
                        </h4>
                        <button className="text-indigo-600 text-xs font-bold hover:underline">Upload New</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-700">Birth Certificate</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Verified • PDF</p>
                               </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                               <Download size={18} />
                            </button>
                         </div>
                         <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-700">Previous Grade 9 Result</p>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Academic • JPG</p>
                               </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                               <Download size={18} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-2 text-xs font-bold ${selectedStudent.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${selectedStudent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                    ACCOUNT STATUS: {selectedStudent.status.toUpperCase()}
                  </span>
               </div>
               <div className="flex gap-3">
                  <button className="px-6 py-2.5 bg-white text-slate-600 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Edit Profile</button>
                  <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Download Report Card</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Admission and Manual Entry Modals (Logic remains similar to previous version but expanded in production) */}
      {isSmartAdmissionOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-amber-500 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={24} />
                <h4 className="text-lg font-bold">AI Smart Admission</h4>
              </div>
              <button onClick={() => setIsSmartAdmissionOpen(false)} className="hover:bg-amber-600 p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Describe the student in natural language (Name, parent info, previous school, etc.). AI will extract structured data instantly.
              </p>
              <textarea 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none font-medium"
                placeholder="e.g. Please admit Harry Potter, son of James and Lily Potter. He joins 10th-B with roll 42. Contact: +1 555-0100."
                value={smartPrompt}
                onChange={(e) => setSmartPrompt(e.target.value)}
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsSmartAdmissionOpen(false)}
                  className="flex-1 py-3 text-slate-500 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSmartAdmission}
                  disabled={isParsing || !smartPrompt.trim()}
                  className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
                >
                  {isParsing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={18} />}
                  {isParsing ? 'Consulting Gemini...' : 'Analyze & Populate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentManagement;
