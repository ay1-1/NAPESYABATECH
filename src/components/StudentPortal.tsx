import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, CreditCard, Award, LogOut, CheckCircle, 
  MapPin, Phone, Mail, FileText, ChevronRight, 
  Lock, Printer, Download, Sparkles, Building, Loader2,
  Menu, X, Search, FileDown
} from 'lucide-react';
import { 
  getStudents, saveStudents, getTransactions, 
  saveTransactions, getPastQuestions, Student, Transaction, PastQuestion 
} from '../lib/mockData';

interface StudentPortalProps {
  onLogout: () => void;
  initialMatric?: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onLogout, initialMatric }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'biodata' | 'payments' | 'past-questions'>('biodata');
  
  // Mobile Menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login State
  const [matricNumber, setMatricNumber] = useState(initialMatric || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile Edit State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<any>('Computer');
  const [level, setLevel] = useState<any>('HND2');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Dues Selection State
  const [paymentType, setPaymentType] = useState<'faculty' | 'department'>('faculty');

  // Payment Checkout State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'otp' | 'processing' | 'success'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Packet Africa Verification State
  const [packetEmail, setPacketEmail] = useState('');
  const [packetRef, setPacketRef] = useState('');
  const [packetDuesType, setPacketDuesType] = useState<'faculty' | 'department'>('faculty');
  const [isVerifyingPacket, setIsVerifyingPacket] = useState(false);
  const [packetVerifyError, setPacketVerifyError] = useState('');
  const [packetVerifySuccess, setPacketVerifySuccess] = useState('');
  
  // Printable Certificates State
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [certType, setCertType] = useState<'faculty' | 'department'>('faculty');

  // Past Questions State
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [searchPqQuery, setSearchPqQuery] = useState('');
  const [filterPqLevel, setFilterPqLevel] = useState('All');
  const [filterPqDept, setFilterPqDept] = useState('All');

  useEffect(() => {
    const loadedStudents = getStudents();
    setStudents(loadedStudents);
    
    // Auto-login if initialMatric is provided
    if (initialMatric) {
      const match = loadedStudents.find(
        s => s.matricNumber.toLowerCase() === initialMatric.toLowerCase()
      );
      if (match) {
        setCurrentStudent(match);
        setProfileFields(match);
      }
    }
  }, [initialMatric]);

  useEffect(() => {
    if (currentStudent) {
      const allTx = getTransactions();
      const studentTx = allTx.filter(t => t.matricNumber === currentStudent.matricNumber);
      setTransactions(studentTx);
      
      // Initialize past questions
      setPastQuestions(getPastQuestions());
      setFilterPqDept(currentStudent.department);
      setFilterPqLevel(currentStudent.level);
      
      // Prefill verification email
      setPacketEmail(currentStudent.email);
    }
  }, [currentStudent]);

  const setProfileFields = (student: Student) => {
    setFullName(student.fullName);
    setEmail(student.email);
    setPhone(student.phone);
    setDepartment(student.department);
    setLevel(student.level);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const allStudents = getStudents();
      const found = allStudents.find(
        s => s.matricNumber.toLowerCase() === matricNumber.trim().toLowerCase()
      );

      if (found && found.password === password) {
        setCurrentStudent(found);
        setProfileFields(found);
        setLoginError('');
      } else {
        setLoginError('Invalid matric number or password. Use F/HD/21/3210001 & password');
      }
      setIsLoggingIn(false);
    }, 1200);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const updatedStudents = students.map(s => {
      if (s.matricNumber === currentStudent.matricNumber) {
        return {
          ...s,
          fullName,
          email,
          phone,
          department,
          level
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    const updatedSelf = updatedStudents.find(s => s.matricNumber === currentStudent.matricNumber);
    if (updatedSelf) {
      setCurrentStudent(updatedSelf);
    }

    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const startCheckout = (type: 'faculty' | 'department') => {
    window.open('https://www.packetafrica.com/pay/napesyabachapterdue', '_blank');
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');

    setTimeout(() => {
      if (!currentStudent) return;

      const isFaculty = paymentType === 'faculty';
      const amt = isFaculty ? 5000 : 3000;
      const purposeText = isFaculty ? "Faculty Dues" : "Departmental Dues";

      // Update student payment status
      const updatedStudents = students.map(s => {
        if (s.matricNumber === currentStudent.matricNumber) {
          const nextFaculty = isFaculty ? true : s.isFacultyPaid;
          const nextDept = !isFaculty ? true : s.isDeptPaid;
          return { 
            ...s, 
            isFacultyPaid: nextFaculty,
            isDeptPaid: nextDept,
            isPaid: nextFaculty && nextDept
          };
        }
        return s;
      });

      setStudents(updatedStudents);
      saveStudents(updatedStudents);
      
      const selfUpdated = updatedStudents.find(s => s.matricNumber === currentStudent.matricNumber);
      if (selfUpdated) {
        setCurrentStudent(selfUpdated);
      }

      // Save Transaction
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        matricNumber: currentStudent.matricNumber,
        studentName: currentStudent.fullName,
        amount: amt,
        purpose: purposeText,
        reference: `NP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString(),
        status: "success"
      };

      const allTx = [newTx, ...getTransactions()];
      saveTransactions(allTx);
      setTransactions(allTx.filter(t => t.matricNumber === currentStudent.matricNumber));

      setPaymentStep('success');
    }, 2000);
  };

  const handleVerifyPacketPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    setPacketVerifyError('');
    setPacketVerifySuccess('');
    setIsVerifyingPacket(true);

    try {
      const response = await fetch('/api/verify-napes-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          matricNumber: currentStudent.matricNumber,
          email: packetEmail.trim(),
          duesType: packetDuesType,
          reference: packetRef.trim() || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const isFaculty = packetDuesType === 'faculty';
        
        // Update student payment status in list and save
        const updatedStudents = students.map(s => {
          if (s.matricNumber === currentStudent.matricNumber) {
            const nextFaculty = isFaculty ? true : s.isFacultyPaid;
            const nextDept = !isFaculty ? true : s.isDeptPaid;
            return {
              ...s,
              isFacultyPaid: nextFaculty,
              isDeptPaid: nextDept,
              isPaid: nextFaculty && nextDept
            };
          }
          return s;
        });

        setStudents(updatedStudents);
        saveStudents(updatedStudents);

        // Update current student state
        const selfUpdated = updatedStudents.find(s => s.matricNumber === currentStudent.matricNumber);
        if (selfUpdated) {
          setCurrentStudent(selfUpdated);
        }

        // Save transaction history record
        const newTx: Transaction = {
          id: data.transaction.id,
          matricNumber: currentStudent.matricNumber,
          studentName: currentStudent.fullName,
          amount: data.transaction.amount,
          purpose: data.transaction.purpose,
          reference: data.transaction.reference,
          date: data.transaction.date,
          status: 'success'
        };

        const allTx = [newTx, ...getTransactions()];
        saveTransactions(allTx);
        setTransactions(allTx.filter(t => t.matricNumber === currentStudent.matricNumber));

        setPacketVerifySuccess(`Clearance successful! ${data.transaction.purpose} verified via Packet Africa.`);
        setPacketRef('');
      } else {
        setPacketVerifyError(data.message || 'Verification failed. Transaction not found or unpaid.');
      }
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setPacketVerifyError('Network error connecting to verification server.');
    } finally {
      setIsVerifyingPacket(false);
    }
  };

  const openCertificate = (type: 'faculty' | 'department') => {
    setCertType(type);
    setCertificateOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Past Questions Filters
  const filteredPastQuestions = pastQuestions.filter(pq => {
    const matchesSearch = pq.title.toLowerCase().includes(searchPqQuery.toLowerCase()) || 
                          pq.courseCode.toLowerCase().includes(searchPqQuery.toLowerCase());
    const matchesLevel = filterPqLevel === 'All' || pq.level === filterPqLevel || pq.level === 'All';
    const matchesDept = filterPqDept === 'All' || pq.department === filterPqDept || pq.department === 'General';
    return matchesSearch && matchesLevel && matchesDept;
  });

  // Login view if not logged in
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10" data-aos="zoom-in">
          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl mx-auto mb-4 hover:rotate-3 transition-transform">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">NAPES Student Portal</h2>
            <p className="text-slate-400 text-sm mt-2">Access your digital dashboard and payments</p>
          </div>

          {/* Login Card (Solid flat theme, no gradients) */}
          <div className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
            {loginError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Matric Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. F/HD/21/3210001"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="w-full px-6 py-4.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-655 focus:outline-none focus:ring-4 focus:ring-red-600/10 transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-3">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4.5 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-655 focus:outline-none focus:ring-4 focus:ring-red-600/10 transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-red-650 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-3"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    Enter Portal <ChevronRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-400 font-medium">
              Demo Credentials: Use <code className="text-red-500">F/HD/21/3210001</code> and <code className="text-red-500">password</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row relative">
      
      {/* MOBILE STICKY HEADER (Mobile only) */}
      <div className="md:hidden bg-secondary text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
            <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-black text-sm tracking-tighter block leading-none">NAPES PORTAL</span>
            <span className="text-[7px] text-primary tracking-[0.2em] font-bold uppercase block mt-0.5">Yabatech Hub</span>
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

      {/* Sidebar (Solid color theme, responsive drawer on mobile) */}
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
              <span className="font-display font-black text-xl tracking-tighter block leading-none">NAPES</span>
              <span className="text-[9px] text-primary tracking-[0.3em] font-bold uppercase">Yabatech Hub</span>
            </div>
          </div>

          {/* Student Profile Quick View */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-display font-black text-base shrink-0">
              {currentStudent.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs truncate text-white leading-tight">{currentStudent.fullName}</h4>
              <span className="text-[9px] text-slate-455 block truncate mt-0.5">{currentStudent.matricNumber}</span>
            </div>
          </div>

          {/* Menu links */}
          <nav className="space-y-2">
            {[
              { id: 'biodata', label: 'Department Biodata', icon: Award },
              { id: 'payments', label: 'Fees & Payments', icon: CreditCard },
              { id: 'past-questions', label: 'Past Questions', icon: FileText },
              { id: 'profile', label: 'Edit Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setMobileMenuOpen(false);
                    setCertificateOpen(false);
                  }}
                  className={`w-full px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-4.5 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
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

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="mt-8 px-5 py-4 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 sm:p-8 md:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Dynamic header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em] block mb-1">Student Dashboard</span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-secondary tracking-tight">
              {activeTab === 'biodata' && 'Departmental Biodata'}
              {activeTab === 'payments' && 'Dues & Financial Clearances'}
              {activeTab === 'past-questions' && 'Past Examination Papers'}
              {activeTab === 'profile' && 'Manage Profile Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start px-4 py-2 rounded-full border border-secondary/10 bg-secondary/5 text-secondary text-[9px] font-bold uppercase tracking-wider">
            Active Session: 2025/2026
          </div>
        </header>

        {/* Dynamic body views */}
        <AnimatePresence mode="wait">
          {/* TAB 1: BIODATA (DIGITAL ID CARD) */}
          {activeTab === 'biodata' && (
            <motion.div
              key="biodata"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Institutional Student Smart ID Card (Solid color, no gradient / glows) */}
              <div className="max-w-md mx-auto w-full">
                <div className="relative w-full aspect-[1.58/1] rounded-3xl bg-secondary text-white p-6 sm:p-8 border border-white/10 shadow-lg overflow-hidden group">
                  
                  {/* Decorative Flat Chip */}
                  <div className="absolute top-24 left-8 w-9 h-7 bg-amber-400 rounded border border-white/10 z-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-5 h-4 opacity-40">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border border-secondary/30 rounded-sm" />
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* ID Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                          <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-xs sm:text-sm tracking-tight leading-none">NAPES YABATECH</h4>
                          <span className="text-[7px] text-primary tracking-widest font-black uppercase mt-1 block">Engineering Council</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[6px] text-slate-400 uppercase tracking-widest block leading-none">Clearance Card</span>
                        <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border mt-1.5 inline-block ${
                          (currentStudent.isFacultyPaid && currentStudent.isDeptPaid) 
                            ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                            : 'bg-orange-500/10 border-orange-500/25 text-orange-400'
                        }`}>
                          {(currentStudent.isFacultyPaid && currentStudent.isDeptPaid) ? 'Fully Cleared' : 'Pending Dues'}
                        </span>
                      </div>
                    </div>

                    {/* ID Middle details */}
                    <div className="flex gap-4 sm:gap-6 items-end mt-2">
                      {/* Avatar */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-2xl sm:text-3xl font-display font-black shadow-inner shrink-0 relative overflow-hidden">
                        {currentStudent.fullName.substring(0, 2).toUpperCase()}
                      </div>

                      {/* Bio Details */}
                      <div className="space-y-1.5 overflow-hidden flex-1">
                        <span className="text-[6px] text-slate-400 uppercase tracking-widest block leading-none">FullName</span>
                        <h3 className="text-sm sm:text-base font-black text-white truncate leading-none">{currentStudent.fullName}</h3>
                        
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <span className="text-[5px] text-slate-400 uppercase tracking-widest block leading-none font-bold">Matric No</span>
                            <span className="text-[9px] font-bold text-white block mt-0.5">{currentStudent.matricNumber}</span>
                          </div>
                          <div>
                            <span className="text-[5px] text-slate-400 uppercase tracking-widest block leading-none font-bold">Department</span>
                            <span className="text-[9px] font-bold text-white block mt-0.5 truncate">{currentStudent.department} Engr.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ID Footer metadata */}
                    <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[6px] text-slate-400 uppercase tracking-widest mt-1">
                      <div className="flex gap-3">
                        <span>Level: <strong className="text-white">{currentStudent.level}</strong></span>
                        <span>Session: <strong className="text-white">{currentStudent.session}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>Smart clearance verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Board */}
              <div className="premium-card p-6 sm:p-8 bg-white">
                <h3 className="text-lg font-display font-black text-secondary tracking-tight mb-3 flex items-center gap-3">
                  <Building size={18} className="text-primary" /> Institutional Registry Info
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-light">
                  This identity card displays verified information synchronized directly from the Yaba College of Technology Engineering Registrar database. Ensure all details are accurate. If you notice discrepancy in matric data, submit a ticket in the footer form.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Matric Verification Status</span>
                    <span className="text-xs font-black text-secondary mt-1 flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-green-600" /> Active Student
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Registry Session Clearance</span>
                    <span className="text-xs font-black text-secondary mt-1">2025/2026 Academic Session</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FEES & CLEARANCE (Double dues card structure, no annual dues header card block) */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Double Dues Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DUES CARD 1: FACULTY DUES */}
                <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between gap-6 ${
                  currentStudent.isFacultyPaid 
                    ? 'bg-green-50/50 border-green-200 text-green-900' 
                    : 'bg-slate-50 border-slate-200 text-secondary'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Institutional Dues</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                        currentStudent.isFacultyPaid ? 'bg-green-100 border-green-300 text-green-600' : 'bg-orange-105 border-orange-200 text-orange-600'
                      }`}>
                        {currentStudent.isFacultyPaid ? 'Cleared' : 'Pending'}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-black tracking-tight">Faculty of Engineering Dues</h3>
                    <p className="text-[11px] opacity-80 leading-relaxed font-light">
                      Annual dues for the general administration of the National Association of Polytechnic Engineering Students (NAPES) at faculty level.
                    </p>
                    <div className="text-xl font-display font-black text-secondary pt-2">₦5,000.00</div>
                  </div>

                  {!currentStudent.isFacultyPaid ? (
                    <button
                      onClick={() => startCheckout('faculty')}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all text-[10px] tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
                    >
                      <CreditCard size={12} /> Pay Faculty Dues
                    </button>
                  ) : (
                    <button
                      onClick={() => openCertificate('faculty')}
                      className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-3.5 rounded-xl transition-all text-[10px] tracking-wider uppercase flex items-center justify-center gap-2"
                    >
                      <Download size={12} /> Faculty Clearance Certificate
                    </button>
                  )}
                </div>

                {/* DUES CARD 2: DEPARTMENTAL DUES */}
                <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between gap-6 ${
                  currentStudent.isDeptPaid 
                    ? 'bg-green-50/50 border-green-200 text-green-900' 
                    : 'bg-slate-50 border-slate-200 text-secondary'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] uppercase tracking-widest font-black text-slate-400">Department Dues</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                        currentStudent.isDeptPaid ? 'bg-green-100 border-green-300 text-green-600' : 'bg-orange-105 border-orange-200 text-orange-600'
                      }`}>
                        {currentStudent.isDeptPaid ? 'Cleared' : 'Pending'}
                      </span>
                    </div>
                    <h3 className="text-lg font-display font-black tracking-tight">{currentStudent.department} Engineering Dues</h3>
                    <p className="text-[11px] opacity-80 leading-relaxed font-light">
                      Specialized dues collected by the departmental executive body to fund local workshops, projects, and lab maintenance.
                    </p>
                    <div className="text-xl font-display font-black text-secondary pt-2">₦3,000.00</div>
                  </div>

                  {!currentStudent.isDeptPaid ? (
                    <button
                      onClick={() => startCheckout('department')}
                      className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3.5 rounded-xl transition-all text-[10px] tracking-wider uppercase shadow-md flex items-center justify-center gap-2"
                    >
                      <CreditCard size={12} /> Pay Department Dues
                    </button>
                  ) : (
                    <button
                      onClick={() => openCertificate('department')}
                      className="w-full bg-secondary hover:bg-secondary/95 text-white font-bold py-3.5 rounded-xl transition-all text-[10px] tracking-wider uppercase flex items-center justify-center gap-2"
                    >
                      <Download size={12} /> Department Clearance Certificate
                    </button>
                  )}
                </div>
              </div>

              {/* Packet Africa Dues Verification Panel */}
              <div className="premium-card p-6 sm:p-8 bg-white border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-display font-black text-secondary tracking-tight">Packet Africa Verification Console</h3>
                    <p className="text-slate-400 text-xs mt-1">Paid your dues on Packet Africa? Sync your payment details below to clear your status instantly.</p>
                  </div>
                  <a 
                    href="https://www.packetafrica.com/pay/napesyabachapterdue" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[9px] uppercase tracking-wider font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 self-start md:self-center"
                  >
                    Go to Checkout Page <ChevronRight size={12} />
                  </a>
                </div>

                {packetVerifyError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <X size={14} className="shrink-0" /> {packetVerifyError}
                  </div>
                )}

                {packetVerifySuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0" /> {packetVerifySuccess}
                  </div>
                )}

                <form onSubmit={handleVerifyPacketPayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Dues Category</label>
                      <select
                        value={packetDuesType}
                        onChange={(e) => setPacketDuesType(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 appearance-none pr-8 bg-no-repeat"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                          backgroundPosition: 'right 12px center'
                        }}
                      >
                        <option value="faculty">Faculty Dues (₦5,000)</option>
                        <option value="department">Departmental Dues (₦3,000)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Payment Email</label>
                      <input
                        type="email"
                        required
                        value={packetEmail}
                        onChange={(e) => setPacketEmail(e.target.value)}
                        placeholder="e.g. student@example.com"
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Transaction Ref / ID (Optional)</label>
                      <input
                        type="text"
                        value={packetRef}
                        onChange={(e) => setPacketRef(e.target.value)}
                        placeholder="e.g. PA-TEST-12345"
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isVerifyingPacket}
                      className="w-full md:w-auto px-8 py-3.5 bg-secondary hover:bg-secondary/95 text-white font-bold rounded-xl transition-all text-[10px] tracking-wider uppercase shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifyingPacket ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Verifying...
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} /> Sync & Clear Dues
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Transactions List */}
              <div className="premium-card p-6 sm:p-8">
                <h3 className="text-lg font-display font-black text-secondary tracking-tight mb-4">Payment History Logs</h3>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                    <FileText size={32} className="text-slate-350 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-light">No transaction records found for this account</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-slate-100 pb-3">
                          <th className="text-[9px] font-bold uppercase text-slate-450 pb-3">Reference</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Purpose</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Amount</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Date</th>
                          <th className="text-[9px] font-bold uppercase text-slate-455 pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 text-xs font-bold text-slate-650">{tx.reference}</td>
                            <td className="py-3.5 text-xs text-secondary font-black">{tx.purpose}</td>
                            <td className="py-3.5 text-xs text-secondary font-black">₦{tx.amount.toLocaleString()}</td>
                            <td className="py-3.5 text-xs text-slate-450">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="py-3.5">
                              <span className="px-2 py-0.5 rounded-full border bg-green-50 border-green-200 text-green-600 text-[8px] font-bold uppercase">
                                {tx.status}
                              </span>
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

          {/* TAB 3: PAST QUESTIONS */}
          {activeTab === 'past-questions' && (
            <motion.div
              key="past-questions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Past Questions Filter & Search Controls */}
              <div className="premium-card p-6 bg-white space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search past questions by course title or code..."
                      value={searchPqQuery}
                      onChange={(e) => setSearchPqQuery(e.target.value)}
                      className="w-full px-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 text-xs font-semibold"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>

                  {/* Dropdown Filters */}
                  <div className="flex gap-2">
                    <select
                      value={filterPqDept}
                      onChange={(e) => setFilterPqDept(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 appearance-none pr-8 bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: 'right 8px center'
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

                    <select
                      value={filterPqLevel}
                      onChange={(e) => setFilterPqLevel(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 appearance-none pr-8 bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: 'right 8px center'
                      }}
                    >
                      <option value="All">All Levels</option>
                      <option value="ND1">ND1</option>
                      <option value="ND2">ND2</option>
                      <option value="HND1">HND1</option>
                      <option value="HND2">HND2</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Past Questions Listing Grid */}
              {filteredPastQuestions.length === 0 ? (
                <div className="text-center py-12 premium-card bg-white">
                  <FileText size={36} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-400 text-xs font-light">No past questions cataloged matching search parameters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPastQuestions.map((pq) => (
                    <div key={pq.id} className="premium-card p-5 bg-white flex justify-between items-center gap-4">
                      <div className="space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-primary text-[8px] font-black uppercase">
                            {pq.courseCode}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            {pq.level}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-secondary truncate" title={pq.title}>{pq.title}</h4>
                        <span className="text-[8px] font-bold text-slate-400 block tracking-wider uppercase">
                          {pq.department} Engr.
                        </span>
                      </div>

                      <a
                        href={pq.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-slate-50 hover:bg-primary/5 border border-slate-200 hover:border-primary/20 text-slate-500 hover:text-primary transition-all rounded-xl shrink-0 flex items-center justify-center"
                        title="Download PDF past questions"
                      >
                        <FileDown size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="premium-card p-6 sm:p-8 bg-white"
            >
              {profileSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle size={14} /> Profile Details Updated Successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Full Student Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Matric Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={currentStudent.matricNumber}
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 transition-all text-xs font-bold cursor-not-allowed"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-350" size={14} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold pr-10"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-350" size={14} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold pr-10"
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-350" size={14} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold text-slate-650 appearance-none bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: 'right 16px center'
                      }}
                    >
                      <option value="Civil">Civil Engineering</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="Electrical">Electrical/Electronics Engr</option>
                      <option value="Computer">Computer Engineering</option>
                      <option value="Chemical">Chemical Engineering</option>
                      <option value="Industrial">Industrial Engineering</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-400 ml-1">Academic Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold text-slate-655 appearance-none bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                        backgroundPosition: 'right 16px center'
                      }}
                    >
                      <option value="ND1">ND1 (National Diploma Year 1)</option>
                      <option value="ND2">ND2 (National Diploma Year 2)</option>
                      <option value="HND1">HND1 (Higher National Diploma Year 1)</option>
                      <option value="HND2">HND2 (Higher National Diploma Year 2)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-8 py-4 rounded-xl transition-all text-[10px] tracking-wider uppercase flex items-center gap-2"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* POP-UP: PRINTABLE CLEARANCE CERTIFICATE OVERLAY (Faculty or Department) */}
      {certificateOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 print:p-0 print:shadow-none print:my-0">
            {/* Action buttons (hidden on print) */}
            <div className="flex justify-between items-center print:hidden border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-secondary text-base">
                {certType === 'faculty' ? 'Faculty Clearance' : 'Departmental Clearance'} Certificate Preview
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-primary hover:bg-primary/95 text-white font-bold px-4 py-2 rounded-xl text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-sm"
                >
                  <Printer size={12} /> Print
                </button>
                <button
                  onClick={() => setCertificateOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold px-4 py-2 rounded-xl text-[10px] tracking-wider uppercase"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Template */}
            <div className="border-8 border-secondary p-6 sm:p-8 bg-white text-center relative overflow-hidden flex flex-col justify-between aspect-[1.41/1] sm:min-h-[480px]">
              
              {/* Certificate Header */}
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto">
                  <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="font-display font-black text-xl text-secondary tracking-tight uppercase">
                  {certType === 'faculty' 
                    ? 'Faculty of Engineering' 
                    : `${currentStudent.department} Engineering Students Association`}
                </h2>
                <h4 className="text-[9px] tracking-[0.3em] font-black uppercase text-primary">Yaba College of Technology</h4>
                <div className="h-0.5 bg-slate-200 w-2/3 mx-auto" />
              </div>

              {/* Certificate Content */}
              <div className="space-y-3 my-4">
                <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                  {certType === 'faculty' ? 'Faculty Level Clearance' : 'Departmental Level Clearance'}
                </span>
                <h1 className="text-lg font-display font-black text-secondary tracking-tight uppercase">
                  {certType === 'faculty' ? 'Faculty Dues Clearance Certificate' : 'Departmental Dues Clearance Certificate'}
                </h1>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed font-light">
                  This is to officially certify that <strong className="text-secondary font-black">{currentStudent.fullName}</strong> with Matric Number <strong className="text-secondary font-bold">{currentStudent.matricNumber}</strong> in the Department of <strong className="text-secondary font-bold">{currentStudent.department} Engineering</strong> ({currentStudent.level}) has cleared all outstanding departmental/faculty dues of <strong className="text-primary font-bold">₦{certType === 'faculty' ? '5,000' : '3,000'}</strong> for the <strong className="text-secondary font-bold">2025/2026</strong> academic session.
                </p>
              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end border-t border-slate-100 pt-5 mt-3">
                <div className="text-left space-y-1">
                  <span className="text-[6px] text-slate-400 uppercase tracking-widest block">Reference ID</span>
                  <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider">
                    {transactions.find(t => t.purpose.toLowerCase().includes(certType))?.reference || 'NP-CLEARANCE'}
                  </span>
                </div>

                {/* Flat verifiable stamp */}
                <div className="relative pr-6">
                  <div className="w-14 h-14 border-2 border-red-500/80 rounded-full border-dashed flex items-center justify-center rotate-12 text-center text-red-500/80 font-black text-[6px] tracking-tighter absolute -top-8 right-2 select-none pointer-events-none opacity-80 uppercase leading-none">
                    NAPES<br />VERIFIED<br />STAMP
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[6px] text-slate-400 uppercase tracking-widest block">Authorized Signatory</span>
                    <span className="text-[8px] font-bold text-slate-800 block">Engr. Samson Beloved</span>
                    <span className="text-[6px] text-slate-450 block">Technical Committee Secretary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP: MOCK PAYSTACK CHECKOUT GATEWAY (Solid flat styles, no gradients) */}
      {checkoutOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-white shadow-2xl relative overflow-hidden">
            {/* Paystack logo bar */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[10px] font-black uppercase tracking-wider">Paystack Secured Checkout</span>
              </div>
              <button 
                onClick={() => setCheckoutOpen(false)}
                className="text-slate-455 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: CARD DETAILS */}
              {paymentStep === 'details' && (
                <motion.form 
                  key="details-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleCardSubmit}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <span className="text-[8px] uppercase tracking-widest text-slate-450">Paying {paymentType} dues to</span>
                    <h3 className="font-display font-black text-base text-white">NAPES Yabatech Council</h3>
                    <div className="text-xl font-black text-emerald-400 mt-1">
                      ₦{paymentType === 'faculty' ? '5,000.00' : '3,000.00'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider font-bold text-slate-455 ml-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\W/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider font-bold text-slate-455 ml-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs font-medium text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider font-bold text-slate-455 ml-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs font-medium text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-all text-[10px] tracking-widest uppercase shadow-md mt-4"
                  >
                    Authenticate Card
                  </button>
                </motion.form>
              )}

              {/* STEP 2: OTP VERIFICATION */}
              {paymentStep === 'otp' && (
                <motion.form 
                  key="otp-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleOtpSubmit}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <h3 className="font-display font-black text-base text-white">Enter OTP Code</h3>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      A simulated One-Time Password has been dispatched to your registered phone number.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-xs font-black tracking-[0.5em] text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-all text-[10px] tracking-widest uppercase shadow-md mt-4"
                  >
                    Authorize ₦{paymentType === 'faculty' ? '5,000.00' : '3,000.00'}
                  </button>
                </motion.form>
              )}

              {/* STEP 3: PROCESSING */}
              {paymentStep === 'processing' && (
                <motion.div 
                  key="processing-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-10 text-center space-y-3"
                >
                  <Loader2 size={40} className="animate-spin text-emerald-500 mx-auto" />
                  <h3 className="font-display font-black text-base">Verifying with Bank...</h3>
                  <p className="text-[10px] text-slate-450 font-light">Processing mock card authorization token.</p>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS */}
              {paymentStep === 'success' && (
                <motion.div 
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-6 text-center space-y-5"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-lg text-white">Payment Successful</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                      Mock payment processed. {paymentType === 'faculty' ? 'Faculty' : 'Departmental'} dues reference cleared. Clearance certificate is now unlocked!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutOpen(false);
                      setActiveTab('payments');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-lg transition-all text-[10px] tracking-wider uppercase"
                  >
                    Return to Payments
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
