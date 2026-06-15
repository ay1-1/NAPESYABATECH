import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, CreditCard, Award, Mail, Key, LogOut, CheckCircle, 
  Trash2, Plus, Edit2, Search, Filter, Shield, 
  Calendar, Check, X, FileText, BarChart2, Lightbulb,
  ChevronRight, Menu, BookOpen, Link2
} from 'lucide-react';
import { 
  getStudents, saveStudents, getTransactions, saveTransactions,
  getElections, saveElections, getTickets, saveTickets,
  getElectionStatus, saveElectionStatus, getPastQuestions, savePastQuestions,
  Student, Transaction, ElectionPost, Candidate, SupportTicket, PastQuestion
} from '../lib/mockData';

interface AdminPortalProps {
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [elections, setElections] = useState<ElectionPost[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isElectionActive, setIsElectionActive] = useState(true);
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);

  // Packet Africa Admin States
  const [packetTransactions, setPacketTransactions] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [isFetchingPacket, setIsFetchingPacket] = useState(false);
  const [paymentsSubTab, setPaymentsSubTab] = useState<'local' | 'packet'>('local');

  // View state
  const [activeTab, setActiveTab] = useState<'students' | 'payments' | 'elections' | 'past-questions' | 'ideas'>('students');

  // Search & Filter State (Student Directory)
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Search & Filter State (Past Questions)
  const [searchPqQuery, setSearchPqQuery] = useState('');
  const [pqDeptFilter, setPqDeptFilter] = useState('All');
  const [pqLevelFilter, setPqLevelFilter] = useState('All');

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
  const [isFacultyPaid, setIsFacultyPaid] = useState(false);
  const [isDeptPaid, setIsDeptPaid] = useState(false);

  // Past Question Form Fields
  const [pqTitle, setPqTitle] = useState('');
  const [pqCourseCode, setPqCourseCode] = useState('');
  const [pqDept, setPqDept] = useState<'Civil' | 'Mechanical' | 'Electrical' | 'Computer' | 'Chemical' | 'Industrial' | 'General'>('Computer');
  const [pqLevel, setPqLevel] = useState<'ND1' | 'ND2' | 'HND1' | 'HND2' | 'All'>('ND1');
  const [pqFileUrl, setPqFileUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [pqFormSuccess, setPqFormSuccess] = useState(false);

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
      setPastQuestions(getPastQuestions());
    }
  }, [isAdminLoggedIn]);

  const fetchPacketTransactions = async () => {
    setIsFetchingPacket(true);
    setSyncMessage("");
    try {
      const response = await fetch('/api/packet-transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch from Packet Africa');
      }
      const data = await response.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      setPacketTransactions(list);
    } catch (err: any) {
      console.error(err);
      setSyncMessage(`Failed to load Packet Africa ledger: ${err.message}`);
    } finally {
      setIsFetchingPacket(false);
    }
  };

  const handleSyncPacketPayments = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const response = await fetch('/api/packet-transactions');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch Packet Africa transactions');
      }

      const packetTxs = Array.isArray(data) ? data : (data.data || []);
      setPacketTransactions(packetTxs);
      
      let newSyncCount = 0;
      const currentStudents = [...students];
      let currentTxs = [...transactions];
      
      packetTxs.forEach((ptx: any) => {
        const status = (ptx.status || "").toLowerCase();
        const isSuccess = status === "success" || status === "successful" || status === "completed" || status === "paid";
        if (!isSuccess) return;

        const amount = parseFloat(ptx.amount || "0");
        const totalAmount = parseFloat(ptx.totalAmount || "0");
        const baseAmount = amount || totalAmount;
        
        let duesType: 'faculty' | 'department' | null = null;
        if (baseAmount === 5000) duesType = 'faculty';
        else if (baseAmount === 3000) duesType = 'department';
        
        if (!duesType) return;

        const email = (ptx.email || (ptx.customer && ptx.customer.email) || "").toLowerCase().trim();
        
        let matric = "";
        if (ptx.matricNumber) {
          matric = ptx.matricNumber;
        } else if (ptx.metadata && (ptx.metadata.matricNumber || ptx.metadata.matric)) {
          matric = ptx.metadata.matricNumber || ptx.metadata.matric;
        } else if (ptx.customer && ptx.customer.customFields) {
          const customKeys = Object.keys(ptx.customer.customFields);
          const matricKey = customKeys.find(k => k.toLowerCase().includes("matric"));
          if (matricKey) {
            matric = ptx.customer.customFields[matricKey];
          }
        }
        matric = matric.toLowerCase().trim();

        const studentIndex = currentStudents.findIndex(s => 
          s.matricNumber.toLowerCase() === matric || 
          s.email.toLowerCase() === email
        );

        if (studentIndex !== -1) {
          const student = currentStudents[studentIndex];
          const isFaculty = duesType === 'faculty';
          const alreadyPaid = isFaculty ? student.isFacultyPaid : student.isDeptPaid;

          if (!alreadyPaid) {
            if (isFaculty) student.isFacultyPaid = true;
            else student.isDeptPaid = true;
            student.isPaid = student.isFacultyPaid && student.isDeptPaid;

            const newTx: Transaction = {
              id: `tx-sync-${ptx.reference || ptx.id || Date.now()}`,
              matricNumber: student.matricNumber,
              studentName: student.fullName,
              amount: baseAmount,
              purpose: isFaculty ? "Faculty Dues (Sync)" : "Departmental Dues (Sync)",
              reference: ptx.reference || `PA-${Math.floor(100000 + Math.random() * 900000)}`,
              date: ptx.createdAt || ptx.date || new Date().toISOString(),
              status: "success"
            };

            currentTxs = [newTx, ...currentTxs];
            newSyncCount++;
          }
        }
      });

      if (newSyncCount > 0) {
        setStudents(currentStudents);
        saveStudents(currentStudents);
        setTransactions(currentTxs);
        saveTransactions(currentTxs);
        setSyncMessage(`Auto-sync complete! ${newSyncCount} new student payment(s) cleared and logged.`);
      } else {
        setSyncMessage("Auto-sync complete. No new pending student payments found on Packet Africa.");
      }
    } catch (err: any) {
      console.error("Sync Error:", err);
      setSyncMessage(`Error syncing payments: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && activeTab === 'payments') {
      fetchPacketTransactions();
    }
  }, [isAdminLoggedIn, activeTab, students]);

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
    setIsFacultyPaid(false);
    setIsDeptPaid(false);
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
    setIsFacultyPaid(student.isFacultyPaid || false);
    setIsDeptPaid(student.isDeptPaid || false);
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
        isPaid: isFacultyPaid && isDeptPaid,
        isFacultyPaid,
        isDeptPaid,
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
            isFacultyPaid,
            isDeptPaid,
            isPaid: isFacultyPaid && isDeptPaid
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

  const toggleDuesPayment = (student: Student, duesType: 'faculty' | 'department') => {
    const updated = students.map(s => {
      if (s.matricNumber === student.matricNumber) {
        const isFaculty = duesType === 'faculty';
        const currentStatus = isFaculty ? s.isFacultyPaid : s.isDeptPaid;
        const nextStatus = !currentStatus;

        // Log transaction if manually setting to paid
        if (nextStatus) {
          const amt = isFaculty ? 5000 : 3000;
          const purpose = isFaculty ? "Faculty Dues (Admin Manual)" : "Departmental Dues (Admin Manual)";
          const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            matricNumber: s.matricNumber,
            studentName: s.fullName,
            amount: amt,
            purpose: purpose,
            reference: `NP-ADM-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString(),
            status: "success"
          };
          const allTx = [newTx, ...transactions];
          setTransactions(allTx);
          saveTransactions(allTx);
        }

        const nextFaculty = isFaculty ? nextStatus : s.isFacultyPaid;
        const nextDept = !isFaculty ? nextStatus : s.isDeptPaid;

        return { 
          ...s, 
          isFacultyPaid: nextFaculty, 
          isDeptPaid: nextDept,
          isPaid: nextFaculty && nextDept
        };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
  };

  // Past Questions Actions
  const handleAddPastQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pqTitle.trim() || !pqCourseCode.trim()) return;

    const newPq: PastQuestion = {
      id: `pq-${Date.now()}`,
      title: pqTitle.trim(),
      courseCode: pqCourseCode.trim().toUpperCase(),
      department: pqDept,
      level: pqLevel,
      fileUrl: pqFileUrl.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = [newPq, ...pastQuestions];
    setPastQuestions(updated);
    savePastQuestions(updated);

    // Clear form
    setPqTitle('');
    setPqCourseCode('');
    setPqFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setPqFormSuccess(true);
    setTimeout(() => setPqFormSuccess(false), 3000);
  };

  const handleDeletePastQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this past question record?')) {
      const updated = pastQuestions.filter(pq => pq.id !== id);
      setPastQuestions(updated);
      savePastQuestions(updated);
    }
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
                       (paymentFilter === 'FacultyCleared' && s.isFacultyPaid) || 
                       (paymentFilter === 'FacultyPending' && !s.isFacultyPaid) || 
                       (paymentFilter === 'DeptCleared' && s.isDeptPaid) || 
                       (paymentFilter === 'DeptPending' && !s.isDeptPaid);
    
    return matchesSearch && matchesDept && matchesPay;
  });

  // Past Questions filtering
  const filteredPastQuestions = pastQuestions.filter(pq => {
    const matchesSearch = pq.title.toLowerCase().includes(searchPqQuery.toLowerCase()) || 
                          pq.courseCode.toLowerCase().includes(searchPqQuery.toLowerCase());
    const matchesDept = pqDeptFilter === 'All' || pq.department === pqDeptFilter;
    const matchesLevel = pqLevelFilter === 'All' || pq.level === pqLevelFilter;
    return matchesSearch && matchesDept && matchesLevel;
  });

  // Analytics Metrics
  const totalRevenue = transactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
  const facultyClearedCount = students.filter(s => s.isFacultyPaid).length;
  const deptClearedCount = students.filter(s => s.isDeptPaid).length;

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10" data-aos="zoom-in">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl mx-auto mb-4 hover:rotate-3 transition-transform">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">Admin Console</h2>
            <p className="text-slate-400 text-sm mt-2">Manage student clearances, payments, and voting</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
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
                    className="w-full px-6 py-4.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-sm font-medium"
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
                    className="w-full px-6 py-4.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-550 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all text-sm font-medium"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-655 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-3 cursor-pointer"
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
      
      {/* MOBILE STICKY HEADER (Mobile only) */}
      <div className="md:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
            <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-tighter block leading-none">NAPES ADMIN</span>
            <span className="text-[7px] text-red-500 tracking-[0.2em] font-bold uppercase block mt-0.5">Yabatech Hub</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY BACKDROP */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-80 bg-slate-900 text-white z-50 p-8 flex flex-col justify-between
        transition-transform duration-300 transform md:translate-x-0 md:static md:h-screen md:w-80 shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-12">
          {/* Drawer Close button (Mobile only) */}
          <div className="flex justify-between items-center md:hidden mb-6 border-b border-white/5 pb-4">
            <span className="font-bold text-[9px] uppercase tracking-widest text-slate-400">Navigation Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-450 hover:text-white border border-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Logo Header */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tighter block leading-none">NAPES ADMIN</span>
              <span className="text-[9px] text-red-500 tracking-[0.3em] font-bold uppercase">Yabatech Hub</span>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-slate-400">
              <span>Security level</span>
              <span className="text-red-500 flex items-center gap-1"><Shield size={10} /> Root</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase tracking-wider text-slate-450 block font-semibold">Revenue</span>
                <strong className="text-xs font-black text-emerald-400 mt-1 block">₦{totalRevenue.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-[8px] uppercase tracking-wider text-slate-455 block font-semibold">Students</span>
                <strong className="text-xs font-black text-white mt-1 block">{students.length}</strong>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {[
              { id: 'students', label: 'Student Directory', icon: Users },
              { id: 'payments', label: 'Payments Auditor', icon: CreditCard },
              { id: 'past-questions', label: 'Past Questions Setup', icon: BookOpen },
              { id: 'elections', label: 'Election & Voting', icon: Award },
              { id: 'ideas', label: 'Napes Ideas Box', icon: Lightbulb },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-4.5 ${
                    activeTab === tab.id
                      ? 'bg-red-655 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-8 px-5 py-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3"
        >
          <LogOut size={14} />
          Lock Portal
        </button>
      </aside>

      {/* Main Administrative Console */}
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto max-w-6xl w-full mx-auto">
        <header className="mb-10">
          <span className="text-[9px] font-black uppercase text-red-500 tracking-[0.2em] block mb-1">Administrative Console</span>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-secondary tracking-tight">
            {activeTab === 'students' && 'Students Management'}
            {activeTab === 'payments' && 'Financial Ledger Auditor'}
            {activeTab === 'past-questions' && 'Past Questions Setup'}
            {activeTab === 'elections' && 'Election Ballot Settings'}
            {activeTab === 'ideas' && 'Napes Student Ideas Box'}
          </h1>
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
              {/* Header metrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-455 block">Total Students</span>
                  <div className="text-2xl font-display font-black text-secondary mt-0.5">{students.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-455 block">Faculty Dues Paid</span>
                  <div className="text-2xl font-display font-black text-green-600 mt-0.5">{facultyClearedCount}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-455 block">Department Dues Paid</span>
                  <div className="text-2xl font-display font-black text-green-600 mt-0.5">{deptClearedCount}</div>
                </div>
              </div>

              {/* Grid actions & search bar */}
              <div className="premium-card p-6 bg-white space-y-6">
                <div className="flex flex-col xl:flex-row justify-between items-stretch gap-4">
                  {/* Search input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search students by name or matric number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/5 transition-all text-xs font-semibold"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450" size={14} />
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-3 items-stretch">
                    <div className="relative flex items-center">
                      <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550 appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                          backgroundPosition: 'right 10px center'
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
                        className="px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-555 appearance-none pr-8"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                          backgroundPosition: 'right 10px center'
                        }}
                      >
                        <option value="All">All Clearance Types</option>
                        <option value="FacultyCleared">Faculty Dues Paid</option>
                        <option value="FacultyPending">Faculty Dues Pending</option>
                        <option value="DeptCleared">Dept Dues Paid</option>
                        <option value="DeptPending">Dept Dues Pending</option>
                      </select>
                    </div>

                    <button
                      onClick={openAddStudent}
                      className="bg-red-655 hover:bg-red-700 text-white font-bold px-5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                    >
                      <Plus size={14} /> Add Student
                    </button>
                  </div>
                </div>

                {/* Directory Table (Responsive scrollable table) */}
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-10">
                    <Users size={32} className="text-slate-350 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-light">No students matches query parameters</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-slate-100 pb-3">
                          <th className="text-[9px] font-bold uppercase text-slate-450 pb-3">Student Info</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Matric No</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Department</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Level</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Faculty Dues</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Dept Dues</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((st) => (
                          <tr key={st.matricNumber} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 font-black text-secondary text-xs">{st.fullName}</td>
                            <td className="py-3.5 text-slate-500 font-bold text-xs">{st.matricNumber}</td>
                            <td className="py-3.5 text-slate-600 text-xs font-semibold">{st.department} Engr.</td>
                            <td className="py-3.5 text-slate-500 text-xs">{st.level}</td>
                            <td className="py-3.5">
                              <button 
                                onClick={() => toggleDuesPayment(st, 'faculty')}
                                className={`px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                                  st.isFacultyPaid 
                                    ? 'bg-green-50 border-green-200 text-green-600' 
                                    : 'bg-orange-50 border-orange-200 text-orange-600'
                                }`}
                              >
                                {st.isFacultyPaid ? 'Cleared' : 'Pending'}
                              </button>
                            </td>
                            <td className="py-3.5">
                              <button 
                                onClick={() => toggleDuesPayment(st, 'department')}
                                className={`px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                                  st.isDeptPaid 
                                    ? 'bg-green-50 border-green-200 text-green-600' 
                                    : 'bg-orange-50 border-orange-200 text-orange-600'
                                }`}
                              >
                                {st.isDeptPaid ? 'Cleared' : 'Pending'}
                              </button>
                            </td>
                            <td className="py-3.5 text-right">
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
              className="space-y-6"
            >
              {/* Auditor Sub Tabs Selector */}
              <div className="flex gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => setPaymentsSubTab('local')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    paymentsSubTab === 'local'
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Local Dues Ledger
                </button>
                <button
                  onClick={() => setPaymentsSubTab('packet')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    paymentsSubTab === 'packet'
                      ? 'bg-secondary text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Link2 size={12} /> Packet Africa Gateway
                </button>
              </div>

              {paymentsSubTab === 'local' ? (
                <div className="premium-card p-6 sm:p-10 bg-white">
                  <h3 className="text-lg font-display font-black text-secondary tracking-tight mb-6">Annual Dues Audit Trail</h3>
                  
                  {transactions.length === 0 ? (
                    <div className="text-center py-10">
                      <CreditCard size={32} className="text-slate-350 mx-auto mb-3" />
                      <p className="text-slate-400 text-xs font-light">No ledger entries detected</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="border-b border-slate-100 pb-3">
                            <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Reference ID</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Student Name</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Matric No</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Amount</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Purpose</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 text-xs font-bold text-slate-650">{tx.reference}</td>
                              <td className="py-3.5 text-xs text-secondary font-black">{tx.studentName}</td>
                              <td className="py-3.5 text-xs text-slate-500 font-medium">{tx.matricNumber}</td>
                              <td className="py-3.5 text-xs text-secondary font-black">₦{tx.amount.toLocaleString()}</td>
                              <td className="py-3.5">
                                <span className="text-[9px] font-bold uppercase text-slate-450">
                                  {tx.purpose}
                                </span>
                              </td>
                              <td className="py-3.5 text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="premium-card p-6 sm:p-10 bg-white space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-display font-black text-secondary tracking-tight">Packet Africa Transaction Logs</h3>
                      <p className="text-slate-400 text-xs mt-1">Live audits and logs retrieved directly from your organization's Packet Africa account.</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={fetchPacketTransactions}
                        disabled={isFetchingPacket}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isFetchingPacket ? 'Refreshing...' : 'Refresh List'}
                      </button>
                      
                      <button
                        onClick={handleSyncPacketPayments}
                        disabled={isSyncing}
                        className="px-5 py-2 bg-red-655 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all uppercase tracking-wider shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                      >
                        {isSyncing ? 'Syncing...' : 'Auto-Sync Dues'}
                      </button>
                    </div>
                  </div>

                  {syncMessage && (
                    <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      syncMessage.toLowerCase().includes('error') || syncMessage.toLowerCase().includes('failed')
                        ? 'bg-red-50 border border-red-200 text-red-700'
                        : 'bg-green-50 border border-green-200 text-green-700'
                    }`}>
                      {syncMessage.toLowerCase().includes('error') || syncMessage.toLowerCase().includes('failed') ? <X size={14} /> : <CheckCircle size={14} />}
                      {syncMessage}
                    </div>
                  )}

                  {isFetchingPacket && packetTransactions.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="animate-spin w-8 h-8 border-4 border-red-555 border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-slate-400 text-xs font-medium">Fetching transaction ledger from Packet Africa...</p>
                    </div>
                  ) : packetTransactions.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl">
                      <CreditCard size={32} className="text-slate-355 mx-auto mb-3" />
                      <p className="text-slate-400 text-xs font-light">No transaction records found on Packet Africa account</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="border-b border-slate-100 pb-3">
                            <th className="text-[9px] font-bold uppercase text-slate-400 pb-3">Reference ID</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Customer Name</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Email</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Matric No</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Amount</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Date</th>
                            <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {packetTransactions.map((tx: any, idx) => {
                            let txMatric = "N/A";
                            if (tx.matricNumber) {
                              txMatric = tx.matricNumber;
                            } else if (tx.metadata && (tx.metadata.matricNumber || tx.metadata.matric)) {
                              txMatric = tx.metadata.matricNumber || tx.metadata.matric;
                            } else if (tx.customer && tx.customer.customFields) {
                              const customKeys = Object.keys(tx.customer.customFields);
                              const matricKey = customKeys.find(k => k.toLowerCase().includes("matric"));
                              if (matricKey) {
                                txMatric = tx.customer.customFields[matricKey];
                              }
                            }

                            const txStatus = (tx.status || "").toUpperCase();
                            const isSuccess = txStatus === "SUCCESS" || txStatus === "SUCCESSFUL" || txStatus === "COMPLETED" || txStatus === "PAID";

                            return (
                              <tr key={tx.reference || tx.id || idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 text-xs font-bold text-slate-650">{tx.reference || tx.id}</td>
                                <td className="py-3.5 text-xs text-secondary font-black">
                                  {tx.customer?.name || tx.studentName || "N/A"}
                                </td>
                                <td className="py-3.5 text-xs text-slate-500 font-medium">
                                  {tx.customer?.email || tx.email || "N/A"}
                                </td>
                                <td className="py-3.5 text-xs text-slate-650 font-bold uppercase">
                                  {txMatric}
                                </td>
                                <td className="py-3.5 text-xs text-secondary font-black">
                                  ₦{(parseFloat(tx.amount || tx.totalAmount || "0")).toLocaleString()}
                                </td>
                                <td className="py-3.5 text-xs text-slate-400">
                                  {new Date(tx.createdAt || tx.date).toLocaleDateString()}
                                </td>
                                <td className="py-3.5">
                                  <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                                    isSuccess
                                      ? 'bg-green-50 border-green-200 text-green-600'
                                      : txStatus === 'FAILED'
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-orange-50 border-orange-200 text-orange-600'
                                  }`}>
                                    {txStatus}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PAST QUESTIONS SETUP */}
          {activeTab === 'past-questions' && (
            <motion.div
              key="past-questions-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Add New Past Question Form */}
              <div className="premium-card p-6 sm:p-8 bg-white">
                <h3 className="text-lg font-display font-black text-secondary tracking-tight mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-red-500" /> Catalog New Past Question
                </h3>

                {pqFormSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-black uppercase tracking-wider">
                    Past Question Added Successfully!
                  </div>
                )}

                <form onSubmit={handleAddPastQuestion} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Course Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Algebra and Trigonometry"
                        value={pqTitle}
                        onChange={(e) => setPqTitle(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Course Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MTH 111"
                        value={pqCourseCode}
                        onChange={(e) => setPqCourseCode(e.target.value)}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Department</label>
                      <select
                        value={pqDept}
                        onChange={(e) => setPqDept(e.target.value as any)}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
                      >
                        <option value="Computer">Computer</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Industrial">Industrial</option>
                        <option value="General">General (Faculty-wide)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Academic Level</label>
                      <select
                        value={pqLevel}
                        onChange={(e) => setPqLevel(e.target.value as any)}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
                      >
                        <option value="ND1">ND1</option>
                        <option value="ND2">ND2</option>
                        <option value="HND1">HND1</option>
                        <option value="HND2">HND2</option>
                        <option value="All">All Levels</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Document URL Link</label>
                      <div className="relative">
                        <input
                          type="url"
                          required
                          value={pqFileUrl}
                          onChange={(e) => setPqFileUrl(e.target.value)}
                          className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary pr-10"
                        />
                        <Link2 className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-8 py-3.5 rounded-xl text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Publish Past Question
                  </button>
                </form>
              </div>

              {/* Past Questions Listing Grid */}
              <div className="premium-card p-6 bg-white space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search published papers by code or title..."
                      value={searchPqQuery}
                      onChange={(e) => setSearchPqQuery(e.target.value)}
                      className="w-full px-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={pqDeptFilter}
                      onChange={(e) => setPqDeptFilter(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500"
                    >
                      <option value="All">All Depts</option>
                      <option value="Computer">Computer</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Industrial">Industrial</option>
                      <option value="General">General</option>
                    </select>

                    <select
                      value={pqLevelFilter}
                      onChange={(e) => setPqLevelFilter(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500"
                    >
                      <option value="All">All Levels</option>
                      <option value="ND1">ND1</option>
                      <option value="ND2">ND2</option>
                      <option value="HND1">HND1</option>
                      <option value="HND2">HND2</option>
                      <option value="All">All</option>
                    </select>
                  </div>
                </div>

                {filteredPastQuestions.length === 0 ? (
                  <p className="text-slate-400 text-xs font-light text-center py-6">No past questions matched the active filters</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPastQuestions.map((pq) => (
                      <div key={pq.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex justify-between items-center gap-4">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-650 text-[8px] font-black uppercase">
                              {pq.courseCode}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">{pq.level}</span>
                          </div>
                          <h4 className="font-bold text-xs text-secondary truncate mt-1">{pq.title}</h4>
                          <span className="text-[8px] font-bold text-slate-400 block tracking-widest uppercase">
                            {pq.department} Engr.
                          </span>
                        </div>

                        <button
                          onClick={() => handleDeletePastQuestion(pq.id)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors shrink-0"
                          title="Delete resource"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: ELECTION SETUP */}
          {activeTab === 'elections' && (
            <motion.div
              key="elections-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Election Configuration Panel */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h3 className="text-lg font-display font-black text-secondary tracking-tight">Active Voting Controls</h3>
                  <p className="text-slate-500 text-xs font-light mt-1 max-w-md font-light leading-relaxed">
                    Setting the election ballot module active allows students to submit ballots via their dashboards when voting opens.
                  </p>
                </div>
                <button
                  onClick={handleToggleElection}
                  className={`font-bold px-6 py-4.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-sm ${
                    isElectionActive 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-slate-200 hover:bg-slate-305 text-slate-655'
                  }`}
                >
                  Status: {isElectionActive ? 'Ballot Open' : 'Ballot Closed'}
                </button>
              </div>

              {/* Add Election Post Form */}
              <div className="premium-card p-6 bg-white">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-455 mb-3">Create New Office Position</h4>
                <form onSubmit={handleAddElectionPost} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Financial Secretary, Provost..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="flex-1 px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/5 text-xs font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-6 py-3.5 rounded-xl text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Create Office
                  </button>
                </form>
              </div>

              {/* Positions List */}
              {elections.map((post) => (
                <div key={post.id} className="premium-card p-6 sm:p-8 bg-white space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Election Office Category</span>
                      <h3 className="text-lg font-display font-black text-secondary tracking-tight mt-0.5">{post.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openAddCandidate(post.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-655 font-bold px-3 py-2 rounded-lg text-[9px] tracking-wider uppercase flex items-center gap-1 transition-colors"
                      >
                        <Plus size={12} /> Add Candidate
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Candidates in Post */}
                  {post.candidates.length === 0 ? (
                    <p className="text-slate-400 text-xs font-light text-center py-4">No candidates allocated for this office yet</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.candidates.map((cand) => (
                        <div key={cand.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center font-display font-black text-red-650 text-sm uppercase">
                                {cand.name.replace('Comr. ', '').replace('Engr. ', '').substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-secondary leading-tight">{cand.name}</h4>
                                <span className="text-[8px] font-black uppercase text-slate-450 block mt-0.5 tracking-widest">Candidate</span>
                              </div>
                            </div>
                            <p className="text-slate-500 text-xs font-light leading-relaxed">
                              "{cand.manifesto}"
                            </p>
                            <div className="text-[9px] font-bold text-slate-455 uppercase tracking-widest">
                              Votes: <strong className="text-secondary">{cand.votes}</strong>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteCandidate(post.id, cand.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 transition-colors shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 5: NAPES IDEAS BOX */}
          {activeTab === 'ideas' && (
            <motion.div
              key="ideas-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="premium-card p-6 bg-white space-y-6"
            >
              <h3 className="text-lg font-display font-black text-secondary tracking-tight">Student Ideas & Support Requests</h3>
              
              {tickets.length === 0 ? (
                <div className="text-center py-10">
                  <Lightbulb size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-400 text-xs font-light">Inbox clean. No pending student ideas or tickets.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-start gap-4 transition-all ${
                        t.status === 'resolved' 
                          ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                          : 'bg-white border-red-100 shadow-sm shadow-red-500/[0.01]'
                      }`}
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-650 text-[8px] font-black uppercase tracking-wider">
                            Category: {t.subject}
                          </span>
                          <span className="text-[9px] text-slate-450 font-bold">
                            {new Date(t.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-500">Submitted by: <strong className="text-secondary">{t.email}</strong></h4>
                        <p className="text-slate-500 text-xs leading-relaxed font-light mt-1.5">
                          "{t.message}"
                        </p>
                      </div>

                      {t.status !== 'resolved' ? (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="bg-secondary hover:bg-secondary/95 text-white font-bold px-4 py-2 rounded-lg text-[9px] tracking-wider uppercase flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0"
                        >
                          <Check size={12} /> Resolve
                        </button>
                      ) : (
                        <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-center shrink-0">
                          <CheckCircle size={12} /> Resolved
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-secondary text-base">
                {modalMode === 'add' ? 'Catalog New Student' : 'Edit Student Profile'}
              </h3>
              <button 
                onClick={() => setStudentModalOpen(false)}
                className="text-slate-450 hover:text-secondary text-sm font-bold"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
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
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold ${
                    modalMode === 'edit' ? 'bg-slate-100 text-slate-450 border-slate-200 cursor-not-allowed text-slate-400' : 'bg-slate-50 border-slate-200 text-secondary'
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-550"
                  >
                    <option value="ND1">ND1</option>
                    <option value="ND2">ND2</option>
                    <option value="HND1">HND1</option>
                    <option value="HND2">HND2</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="isFacultyPaidCheck"
                    checked={isFacultyPaid}
                    onChange={(e) => setIsFacultyPaid(e.target.checked)}
                    className="w-4 h-4 rounded text-red-655 focus:ring-red-655/20"
                  />
                  <label htmlFor="isFacultyPaidCheck" className="text-xs text-secondary font-black cursor-pointer">
                    Approve Faculty Dues Clearance (₦5,000)
                  </label>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="isDeptPaidCheck"
                    checked={isDeptPaid}
                    onChange={(e) => setIsDeptPaid(e.target.checked)}
                    className="w-4 h-4 rounded text-red-655 focus:ring-red-655/20"
                  />
                  <label htmlFor="isDeptPaidCheck" className="text-xs text-secondary font-black cursor-pointer">
                    Approve Department Dues Clearance (₦3,000)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 text-white font-bold py-4.5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg mt-4"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-black text-secondary text-base">Add Ballot Candidate</h3>
              <button 
                onClick={() => setCandidateModalOpen(false)}
                className="text-slate-450 hover:text-secondary text-sm font-bold"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-secondary"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none leading-relaxed text-secondary"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-650 hover:bg-red-700 text-white font-bold py-4.5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg mt-4"
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
