import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CreditCard, Award, Mail, Key, LogOut, CheckCircle, 
  Trash2, Plus, Edit2, Search, Filter, Shield, 
  Calendar, Check, X, FileText, BarChart2, Lightbulb,
  ChevronRight
} from 'lucide-react';
import { 
  getStudents, saveStudents, getTransactions, saveTransactions,
  getElections, saveElections, getTickets, saveTickets,
  getElectionStatus, saveElectionStatus, Student, Transaction,
  ElectionPost, Candidate, SupportTicket
} from '../lib/mockData';

interface AdminPortalProps {
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [elections, setElections] = useState<ElectionPost[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isElectionActive, setIsElectionActive] = useState(true);

  // View state
  const [activeTab, setActiveTab] = useState<'students' | 'payments' | 'elections' | 'ideas'>('students');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Add/Edit Student Modal State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStudentMatric, setSelectedStudentMatric] = useState('');
  
  // Student Form Fields
  const [fullName, setFullName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<'Civil' | 'Mechanical' | 'Electrical' | 'Computer' | 'Chemical' | 'Industrial'>('Computer');
  const [level, setLevel] = useState<'ND1' | 'ND2' | 'HND1' | 'HND2'>('HND2');
  const [isPaid, setIsPaid] = useState(false);

  // Election Setup States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [candName, setCandName] = useState('');
  const [candManifesto, setCandManifesto] = useState('');

  useEffect(() => {
    if (isAdminLoggedIn) {
      setStudents(getStudents());
      setTransactions(getTransactions());
      setElections(getElections());
      setTickets(getTickets());
      setIsElectionActive(getElectionStatus());
    }
  }, [isAdminLoggedIn]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin / admin');
    }
  };

  // Student Actions
  const openAddStudent = () => {
    setModalMode('add');
    setFullName('');
    setMatricNumber('');
    setEmail('');
    setPhone('');
    setDepartment('Computer');
    setLevel('HND2');
    setIsPaid(false);
    setStudentModalOpen(true);
  };

  const openEditStudent = (student: Student) => {
    setModalMode('edit');
    setSelectedStudentMatric(student.matricNumber);
    setFullName(student.fullName);
    setMatricNumber(student.matricNumber);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartment(student.department);
    setLevel(student.level);
    setIsPaid(student.isPaid);
    setStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Student[] = [];

    if (modalMode === 'add') {
      // Check if duplicate matric
      if (students.some(s => s.matricNumber.toLowerCase() === matricNumber.trim().toLowerCase())) {
        alert('Student with this matric number already exists.');
        return;
      }
      const newStudent: Student = {
        fullName,
        matricNumber: matricNumber.trim(),
        email,
        phone,
        department,
        level,
        session: "2025/2026",
        isPaid,
        password: 'password'
      };
      updated = [...students, newStudent];
    } else {
      updated = students.map(s => {
        if (s.matricNumber === selectedStudentMatric) {
          return {
            ...s,
            fullName,
            email,
            phone,
            department,
            level,
            isPaid
          };
        }
        return s;
      });
    }

    setStudents(updated);
    saveStudents(updated);
    setStudentModalOpen(false);
  };

  const handleDeleteStudent = (matric: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      const updated = students.filter(s => s.matricNumber !== matric);
      setStudents(updated);
      saveStudents(updated);
    }
  };

  const togglePayment = (student: Student) => {
    const updated = students.map(s => {
      if (s.matricNumber === student.matricNumber) {
        const nextPaid = !s.isPaid;
        
        // Log transaction if manually setting to paid
        if (nextPaid) {
          const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            matricNumber: s.matricNumber,
            studentName: s.fullName,
            amount: 5000,
            purpose: "NAPES Annual Dues (Admin Manual)",
            reference: `NP-ADM-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString(),
            status: "success"
          };
          const allTx = [newTx, ...transactions];
          setTransactions(allTx);
          saveTransactions(allTx);
        }

        return { ...s, isPaid: nextPaid };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
  };

  // Election Actions
  const handleToggleElection = () => {
    const nextStatus = !isElectionActive;
    setIsElectionActive(nextStatus);
    saveElectionStatus(nextStatus);
  };

  const handleAddElectionPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost: ElectionPost = {
      id: `post-${Date.now()}`,
      title: newPostTitle.trim(),
      candidates: []
    };

    const updated = [...elections, newPost];
    setElections(updated);
    saveElections(updated);
    setNewPostTitle('');
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this office category?')) {
      const updated = elections.filter(p => p.id !== postId);
      setElections(updated);
      saveElections(updated);
    }
  };

  const openAddCandidate = (postId: string) => {
    setSelectedPostId(postId);
    setCandName('');
    setCandManifesto('');
    setCandidateModalOpen(true);
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim()) return;

    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      name: candName.trim(),
      manifesto: candManifesto.trim(),
      votes: 0
    };

    const updated = elections.map(post => {
      if (post.id === selectedPostId) {
        return {
          ...post,
          candidates: [...post.candidates, newCand]
        };
      }
      return post;
    });

    setElections(updated);
    saveElections(updated);
    setCandidateModalOpen(false);
  };

  const handleDeleteCandidate = (postId: string, candId: string) => {
    if (confirm('Remove this candidate?')) {
      const updated = elections.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            candidates: post.candidates.filter(c => c.id !== candId)
          };
        }
        return post;
      });
      setElections(updated);
      saveElections(updated);
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'resolved' as any };
      }
      return t;
    });
    setTickets(updated);
    saveTickets(updated);
  };

  // Student filtering
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.matricNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    const matchesPay = paymentFilter === 'All' || 
                       (paymentFilter === 'Cleared' && s.isPaid) || 
                       (paymentFilter === 'Pending' && !s.isPaid);
    
    return matchesSearch && matchesDept && matchesPay;
  });

  // Analytics Metrics
  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
  const clearedCount = students.filter(s => s.isPaid).length;
  const pendingCount = students.filter(s => !s.isPaid).length;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10" data-aos="zoom-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl mx-auto mb-4 hover:rotate-3 transition-transform">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">Admin Console</h2>
            <p className="text-slate-400 text-sm mt-2">Manage student clearances, payments, and voting</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
            {loginError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Admin Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="admin"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full px-6 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all text-sm font-medium"
                  />
                  <Shield className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Master Key Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-6 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all text-sm font-medium"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-3"
              >
                Unlock Dashboard <ChevronRight size={14} />
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400 font-medium">
              Use Credentials: <code className="text-red-500">admin</code> & <code className="text-red-500">admin</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-slate-900 text-white shrink-0 flex flex-col justify-between p-8 md:sticky md:top-0 md:h-screen z-20">
        <div className="space-y-12">
          {/* Logo Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tighter block leading-none">NAPES ADMIN</span>
              <span className="text-[9px] text-red-500 tracking-[0.3em] font-bold uppercase">Yabatech Hub</span>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
              <span>Security level</span>
              <span className="text-red-500 flex items-center gap-1"><Shield size={10} /> Root</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Dues Revenue</span>
                <strong className="text-sm font-black text-emerald-400 mt-1 block">₦{totalRevenue.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-wider text-slate-400 block">Total Students</span>
                <strong className="text-sm font-black text-white mt-1 block">{students.length}</strong>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {[
              { id: 'students', label: 'Student Directory', icon: Users },
              { id: 'payments', label: 'Payments Auditor', icon: CreditCard },
              { id: 'elections', label: 'Election & Voting', icon: Award },
              { id: 'ideas', label: 'Napes Ideas Box', icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-6 py-4.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-4 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-8 px-6 py-4.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3"
        >
          <LogOut size={16} />
          Lock Portal
        </button>
      </aside>

      {/* Main Administrative Console */}
      <main className="flex-1 p-6 sm:p-10 md:p-12 overflow-y-auto max-w-6xl w-full mx-auto">
        <header className="mb-12 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div>
            <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] block mb-2">Administrative Console</span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-secondary tracking-tight">
              {activeTab === 'students' && 'Students Management'}
              {activeTab === 'payments' && 'Financial Ledger Auditor'}
              {activeTab === 'elections' && 'Election Ballot Settings'}
              {activeTab === 'ideas' && 'Napes Student Ideas Box'}
            </h1>
          </div>
        </header>

        {/* Dynamic Panel tab switching */}
        <AnimatePresence mode="wait">
          {/* TAB 1: STUDENT DIRECTORY */}
          {activeTab === 'students' && (
            <motion.div
              key="students-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Header metrics card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Total Cataloged</span>
                  <div className="text-3xl font-display font-black text-secondary mt-1">{students.length}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Dues Paid</span>
                  <div className="text-3xl font-display font-black text-green-600 mt-1">{clearedCount}</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block">Dues Pending</span>
                  <div className="text-3xl font-display font-black text-orange-650 mt-1">{pendingCount}</div>
                </div>
              </div>

              {/* Grid actions & search bar */}
              <div className="premium-card p-6 sm:p-8 bg-white space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
                  {/* Search input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search students by name or matric number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-12 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-xs font-semibold"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-3 items-stretch">
                    <div className="relative flex items-center">
                      <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 appearance-none pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                          backgroundPosition: 'right 12px center'
                        }}
                      >
                        <option value="All">All Departments</option>
                        <option value="Civil">Civil Engr</option>
                        <option value="Mechanical">Mechanical Engr</option>
                        <option value="Electrical">Electrical Engr</option>
                        <option value="Computer">Computer Engr</option>
                        <option value="Chemical">Chemical Engr</option>
                        <option value="Industrial">Industrial Engr</option>
                      </select>
                    </div>

                    <div className="relative flex items-center">
                      <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 appearance-none pr-10"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                          backgroundPosition: 'right 12px center'
                        }}
                      >
                        <option value="All">All Clearances</option>
                        <option value="Cleared">Cleared Only</option>
                        <option value="Pending">Clearance Pending</option>
                      </select>
                    </div>

                    <button
                      onClick={openAddStudent}
                      className="bg-red-600 hover:bg-red-750 text-white font-bold px-6 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shrink-0"
                    >
                      <Plus size={14} /> Add Student
                    </button>
                  </div>
                </div>

                {/* Directory Table */}
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-light">No students matches query parameters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 pb-3">
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Student Info</th>
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Matric No</th>
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Department</th>
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Level</th>
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Cleared</th>
                          <th className="text-[9px] font-bold uppercase text-slate-400 pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((st) => (
                          <tr key={st.matricNumber} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 font-black text-secondary text-xs">{st.fullName}</td>
                            <td className="py-4 text-slate-500 font-bold text-xs">{st.matricNumber}</td>
                            <td className="py-4 text-slate-650 text-xs font-semibold">{st.department} Engr.</td>
                            <td className="py-4 text-slate-500 text-xs">{st.level}</td>
                            <td className="py-4">
                              <button 
                                onClick={() => togglePayment(st)}
                                className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
                                  st.isPaid 
                                    ? 'bg-green-50 border-green-200 text-green-600' 
                                    : 'bg-orange-50 border-orange-200 text-orange-600'
                                }`}
                              >
                                {st.isPaid ? 'Approved' : 'Pending'}
                              </button>
                            </td>
                            <td className="py-4 text-right">
                              <div className="inline-flex gap-2">
                                <button 
                                  onClick={() => openEditStudent(st)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteStudent(st.matricNumber)}
                                  className="p-2 rounded-lg bg-slate-100 hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: PAYMENTS LEDGER */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="premium-card p-6 sm:p-10 bg-white"
            >
              <h3 className="text-xl font-display font-black text-secondary tracking-tight mb-6">Annual Dues Audit Trail</h3>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard size={32} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs font-light">No ledger entries detected</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 pb-3">
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Reference ID</th>
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Student Name</th>
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Matric No</th>
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Amount</th>
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Channel</th>
                        <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 text-xs font-bold text-slate-600">{tx.reference}</td>
                          <td className="py-4 text-xs text-secondary font-black">{tx.studentName}</td>
                          <td className="py-4 text-xs text-slate-500 font-medium">{tx.matricNumber}</td>
                          <td className="py-4 text-xs text-secondary font-black">₦{tx.amount.toLocaleString()}</td>
                          <td className="py-4">
                            <span className="text-[9px] font-bold uppercase text-slate-400">
                              {tx.purpose.includes('Admin') ? 'Admin Manual' : 'Paystack API'}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ELECTION SETUP */}
          {activeTab === 'elections' && (
            <motion.div
              key="elections-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Election Configuration Panel */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-xl font-display font-black text-secondary tracking-tight">Active Voting Controls</h3>
                  <p className="text-slate-500 text-xs font-light mt-1 max-w-md">
                    Setting the election ballot module active allows students to submit ballots via their dashboards when voting opens.
                  </p>
                </div>
                <button
                  onClick={handleToggleElection}
                  className={`font-bold px-6 py-4.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm ${
                    isElectionActive 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-slate-200 hover:bg-slate-350 text-slate-600'
                  }`}
                >
                  Status: {isElectionActive ? 'Ballot Open' : 'Ballot Closed'}
                </button>
              </div>

              {/* Add Election Post Form */}
              <div className="premium-card p-6 sm:p-8 bg-white">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4">Create New Office Position</h4>
                <form onSubmit={handleAddElectionPost} className="flex gap-4">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Financial Secretary, Provost..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 text-xs font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase shadow-md flex items-center gap-2"
                  >
                    <Plus size={14} /> Create Office
                  </button>
                </form>
              </div>

              {/* Positions List */}
              {elections.map((post) => (
                <div key={post.id} className="premium-card p-8 bg-white space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Election Office Category</span>
                      <h3 className="text-xl font-display font-black text-secondary tracking-tight mt-1">{post.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAddCandidate(post.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={12} /> Add Candidate
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Candidates in Post */}
                  {post.candidates.length === 0 ? (
                    <p className="text-slate-400 text-xs font-light text-center py-6">No candidates allocated for this office yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {post.candidates.map((cand) => (
                        <div key={cand.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center font-display font-black text-red-600 text-base uppercase">
                                {cand.name.replace('Comr. ', '').replace('Engr. ', '').substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-secondary leading-tight">{cand.name}</h4>
                                <span className="text-[8px] font-black uppercase text-slate-400 block mt-1 tracking-widest">Candidate Info</span>
                              </div>
                            </div>
                            <p className="text-slate-500 text-xs font-light leading-relaxed">
                              "{cand.manifesto}"
                            </p>
                            <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>Votes Logged: <strong className="text-secondary">{cand.votes}</strong></span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteCandidate(post.id, cand.id)}
                            className="text-slate-350 hover:text-red-500 p-2 transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 4: NAPES IDEAS BOX */}
          {activeTab === 'ideas' && (
            <motion.div
              key="ideas-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="premium-card p-6 sm:p-10 bg-white"
            >
              <h3 className="text-xl font-display font-black text-secondary tracking-tight mb-6">Student Ideas & Support Requests</h3>
              
              {tickets.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb size={36} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs font-light">Inbox clean. No pending student ideas or tickets.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {tickets.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start gap-4 transition-all ${
                        t.status === 'resolved' 
                          ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                          : 'bg-white border-red-100 shadow-sm shadow-red-500/[0.02]'
                      }`}
                    >
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-600 text-[8px] font-black uppercase tracking-wider">
                            Category: {t.subject}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(t.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-500">Submitted by: <strong className="text-secondary">{t.email}</strong></h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-light mt-2">
                          "{t.message}"
                        </p>
                      </div>

                      {t.status !== 'resolved' ? (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="bg-secondary hover:bg-secondary/95 text-white font-bold px-4 py-2.5 rounded-xl text-[9px] tracking-wider uppercase flex items-center gap-1.5 transition-colors self-start sm:self-center"
                        >
                          <Check size={12} /> Resolve Request
                        </button>
                      ) : (
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-center">
                          <CheckCircle size={14} /> Resolved
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL: ADD / EDIT STUDENT */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-secondary text-lg">
                {modalMode === 'add' ? 'Catalog New Student' : 'Edit Student Profile'}
              </h3>
              <button 
                onClick={() => setStudentModalOpen(false)}
                className="text-slate-400 hover:text-secondary text-sm font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samson Beloved"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Matric Number</label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  placeholder="e.g. F/HD/21/3210001"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border text-xs font-semibold ${
                    modalMode === 'edit' ? 'bg-slate-100 text-slate-450 border-slate-200 cursor-not-allowed' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
                  >
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Computer">Computer</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
                  >
                    <option value="ND1">ND1</option>
                    <option value="ND2">ND2</option>
                    <option value="HND1">HND1</option>
                    <option value="HND2">HND2</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <input
                  type="checkbox"
                  id="isPaidCheck"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-4 h-4 rounded text-red-500 focus:ring-red-500/20"
                />
                <label htmlFor="isPaidCheck" className="text-xs text-secondary font-black">
                  Approve Annual Dues clearance immediately
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-750 text-white font-bold py-4.5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg mt-6"
              >
                {modalMode === 'add' ? 'Catalog Student' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CANDIDATE */}
      {candidateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-secondary text-lg">Add Ballot Candidate</h3>
              <button 
                onClick={() => setCandidateModalOpen(false)}
                className="text-slate-400 hover:text-secondary text-sm font-bold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Candidate Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Comr. Olatunji Williams"
                  value={candName}
                  onChange={(e) => setCandName(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Manifesto / Slogan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter candidate manifesto or legacy campaign slogan..."
                  value={candManifesto}
                  onChange={(e) => setCandManifesto(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-750 text-white font-bold py-4.5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg mt-6"
              >
                Allocate Candidate
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
