import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, CreditCard, Award, LogOut, CheckCircle, 
  MapPin, Phone, Mail, FileText, ChevronRight, 
  Lock, Printer, Download, Sparkles, Building, Loader2 
} from 'lucide-react';
import { 
  getStudents, saveStudents, getTransactions, 
  saveTransactions, Student, Transaction 
} from '../lib/mockData';

interface StudentPortalProps {
  onLogout: () => void;
  initialMatric?: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onLogout, initialMatric }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'biodata' | 'payments'>('biodata');
  
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

  // Payment Checkout State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'otp' | 'processing' | 'success'>('details');
  const [otpCode, setOtpCode] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Print Certificate State
  const [certificateOpen, setCertificateOpen] = useState(false);

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

  const startCheckout = () => {
    setPaymentStep('details');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setOtpCode('');
    setCheckoutOpen(true);
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

      // Update student payment status
      const updatedStudents = students.map(s => {
        if (s.matricNumber === currentStudent.matricNumber) {
          return { ...s, isPaid: true };
        }
        return s;
      });

      setStudents(updatedStudents);
      saveStudents(updatedStudents);
      setCurrentStudent(prev => prev ? { ...prev, isPaid: true } : null);

      // Save Transaction
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        matricNumber: currentStudent.matricNumber,
        studentName: currentStudent.fullName,
        amount: 5000,
        purpose: "NAPES Annual Dues",
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

  const handlePrint = () => {
    window.print();
  };

  // Login view if not logged in
  if (!currentStudent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10" data-aos="zoom-in">
          {/* Logo header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-3 shadow-2xl mx-auto mb-4 hover:rotate-3 transition-transform">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h2 className="text-3xl font-display font-black text-white tracking-tight">NAPES Student Portal</h2>
            <p className="text-slate-400 text-sm mt-2">Access your digital dashboard and payments</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
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
                  className="w-full px-6 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all text-sm font-medium"
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
                  className="w-full px-6 py-4.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl transition-all text-xs tracking-widest uppercase shadow-xl shadow-red-600/10 flex items-center justify-center gap-3"
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
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-secondary text-white shrink-0 flex flex-col justify-between p-8 md:sticky md:top-0 md:h-screen z-20">
        <div className="space-y-12">
          {/* Logo Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
              <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tighter block leading-none">NAPES</span>
              <span className="text-[9px] text-primary tracking-[0.3em] font-bold uppercase">Yabatech Hub</span>
            </div>
          </div>

          {/* Student Profile Quick View */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-display font-black text-lg">
              {currentStudent.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm truncate text-white leading-tight">{currentStudent.fullName}</h4>
              <span className="text-[10px] text-slate-400 block truncate font-medium mt-1">{currentStudent.matricNumber}</span>
            </div>
          </div>

          {/* Menu links */}
          <nav className="space-y-3">
            {[
              { id: 'biodata', label: 'Department Biodata', icon: Award },
              { id: 'payments', label: 'Fees & Payments', icon: CreditCard },
              { id: 'profile', label: 'Edit Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setCertificateOpen(false);
                  }}
                  className={`w-full px-6 py-4.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-4 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
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

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="mt-8 px-6 py-4.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 sm:p-10 md:p-12 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Dynamic header */}
        <header className="mb-12 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <div>
            <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] block mb-2">Student Dashboard</span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-secondary tracking-tight">
              {activeTab === 'biodata' && 'Departmental Biodata'}
              {activeTab === 'payments' && 'Fees & Clearance'}
              {activeTab === 'profile' && 'Manage Profile Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start px-5 py-2.5 rounded-full border border-secondary/10 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-wider">
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
              className="space-y-10"
            >
              {/* Premium Student Smart ID Card */}
              <div className="perspective-1000 max-w-md mx-auto">
                <div className="relative w-full aspect-[1.58/1] rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-secondary to-slate-950 text-white p-8 border border-white/15 shadow-2xl overflow-hidden group transition-all duration-500 hover:shadow-primary/10">
                  {/* Glowing background highlights */}
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[60px]" />
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/10 rounded-full blur-[60px]" />
                  
                  {/* Decorative Chip & Contactless */}
                  <div className="absolute top-24 left-8 w-10 h-8 bg-gradient-to-tr from-yellow-400 to-amber-200 rounded-md border border-white/10 z-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-6 h-5 opacity-40">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="border border-secondary/30 rounded-sm" />
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* ID Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md">
                          <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-display font-black text-sm tracking-tight leading-none">NAPES YABATECH</h4>
                          <span className="text-[8px] text-primary tracking-widest font-black uppercase mt-1 block">Engineering Council</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-slate-400 uppercase tracking-widest block">Clearance Card</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border mt-1.5 inline-block ${
                          currentStudent.isPaid 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                        }`}>
                          {currentStudent.isPaid ? 'Cleared' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* ID Middle details */}
                    <div className="flex gap-6 items-end mt-4">
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-3xl font-display font-black shadow-inner shrink-0 relative overflow-hidden">
                        {currentStudent.fullName.substring(0, 2).toUpperCase()}
                      </div>

                      {/* Bio Details */}
                      <div className="space-y-1.5 overflow-hidden">
                        <span className="text-[7px] text-slate-400 uppercase tracking-widest block leading-none">FullName</span>
                        <h3 className="text-base font-black text-white truncate leading-none">{currentStudent.fullName}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-[6px] text-slate-400 uppercase tracking-widest block leading-none">Matric No</span>
                            <span className="text-[10px] font-bold text-white block mt-0.5">{currentStudent.matricNumber}</span>
                          </div>
                          <div>
                            <span className="text-[6px] text-slate-400 uppercase tracking-widest block leading-none">Department</span>
                            <span className="text-[10px] font-bold text-white block mt-0.5">{currentStudent.department} Engr.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ID Footer metadata */}
                    <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[7px] text-slate-400 uppercase tracking-widest mt-2">
                      <div className="flex gap-4">
                        <span>Level: <strong className="text-white">{currentStudent.level}</strong></span>
                        <span>Session: <strong className="text-white">{currentStudent.session}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Smart clearance enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Board */}
              <div className="premium-card p-8 bg-white border border-slate-100 shadow-md">
                <h3 className="text-xl font-display font-black text-secondary tracking-tight mb-4 flex items-center gap-3">
                  <Building size={20} className="text-primary" /> Institutional Registry Info
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-light">
                  This identity card displays verified information synchronized directly from the Yaba College of Technology Engineering Registrar database. Ensure all details are accurate. If you notice discrepancy in matric data, submit a ticket in the footer form.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-50 pt-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Matric Verification Status</span>
                    <span className="text-sm font-black text-secondary mt-1 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" /> Active Student
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registry Session Clearance</span>
                    <span className="text-sm font-black text-secondary mt-1">2025/2026 Academic Session</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FEES & CLEARANCE */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Clearance Status Card */}
              <div className={`p-8 rounded-[2.5rem] border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 ${
                currentStudent.isPaid 
                  ? 'bg-green-50/50 border-green-200/60 text-green-900' 
                  : 'bg-orange-50/50 border-orange-200/60 text-orange-950'
              }`}>
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    currentStudent.isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight">
                      Annual Chapter Dues: {currentStudent.isPaid ? 'Cleared & Active' : 'Outstanding Payment'}
                    </h3>
                    <p className="text-xs opacity-80 mt-1 font-medium max-w-md">
                      {currentStudent.isPaid 
                        ? 'Your dues payment is cleared. You can now download and print your official receipt and dues clearance certificate.'
                        : 'Outstanding balance of ₦5,000 required. Pay dues to unlock clearance certificates and vote in engineering elections.'}
                    </p>
                  </div>
                </div>

                {!currentStudent.isPaid ? (
                  <button
                    onClick={startCheckout}
                    className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4.5 rounded-xl transition-all shadow-md tracking-wider text-xs uppercase self-start sm:self-center"
                  >
                    Pay Dues (₦5,000)
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCertificateOpen(true)}
                      className="bg-secondary hover:bg-secondary/95 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-sm text-xs tracking-wider uppercase flex items-center gap-2"
                    >
                      <Download size={14} /> Download Certificate
                    </button>
                  </div>
                )}
              </div>

              {/* Transactions List */}
              <div className="premium-card p-8 sm:p-10">
                <h3 className="text-xl font-display font-black text-secondary tracking-tight mb-6">Payment History Logs</h3>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                    <FileText size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 text-sm">No transaction records found for this account</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 pb-4">
                          <th className="text-[10px] font-bold uppercase text-slate-400 pb-4">Reference</th>
                          <th className="text-[10px] font-bold uppercase text-slate-400 pb-4">Purpose</th>
                          <th className="text-[10px] font-bold uppercase text-slate-400 pb-4">Amount</th>
                          <th className="text-[10px] font-bold uppercase text-slate-400 pb-4">Date</th>
                          <th className="text-[10px] font-bold uppercase text-slate-400 pb-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 text-xs font-bold text-slate-600">{tx.reference}</td>
                            <td className="py-4 text-xs text-secondary font-black">{tx.purpose}</td>
                            <td className="py-4 text-xs text-secondary font-black">₦{tx.amount.toLocaleString()}</td>
                            <td className="py-4 text-xs text-slate-400">{new Date(tx.date).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className="px-2 py-0.5 rounded-full border bg-green-50 border-green-200 text-green-600 text-[9px] font-bold uppercase">
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

          {/* TAB 3: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="premium-card p-8 sm:p-10 bg-white"
            >
              {profileSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle size={16} /> Profile Details Updated Successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Full Student Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Matric Number (Immutable)</label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={currentStudent.matricNumber}
                        className="w-full px-6 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 transition-all text-sm font-bold cursor-not-allowed"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium pr-10"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium pr-10"
                      />
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as any)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium text-slate-600 appearance-none bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
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

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Academic Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium text-slate-600 appearance-none bg-no-repeat"
                      style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='%2364748b' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
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

                <div className="border-t border-slate-50 pt-6">
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/95 text-white font-bold px-10 py-4.5 rounded-xl transition-all shadow-md text-xs tracking-wider uppercase flex items-center gap-2"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* POP-UP: PRINTABLE CLEARANCE CERTIFICATE OVERLAY */}
      {certificateOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-8 print:p-0 print:shadow-none print:my-0">
            {/* Action buttons (hidden on print) */}
            <div className="flex justify-between items-center print:hidden border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-secondary text-lg">Clearance Certificate Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-primary hover:bg-primary/95 text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm"
                >
                  <Printer size={14} /> Print Document
                </button>
                <button
                  onClick={() => setCertificateOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-2.5 rounded-xl text-xs tracking-wider uppercase"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Certificate Template */}
            <div className="border-8 border-secondary p-8 bg-white text-center relative overflow-hidden flex flex-col justify-between aspect-[1.41/1] sm:min-h-[500px]">
              {/* Watermark Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-96 h-96">
                <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>

              {/* Certificate Header */}
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto">
                  <img src="/napeslogo.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="font-display font-black text-2xl text-secondary tracking-tight uppercase">National Association of Polytechnic Engineering Students</h2>
                <h4 className="text-[10px] tracking-[0.3em] font-black uppercase text-primary">Yaba College of Technology Chapter</h4>
                <div className="h-0.5 bg-slate-250 w-2/3 mx-auto" />
              </div>

              {/* Certificate Content */}
              <div className="space-y-4 my-6">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Official Chapter Clearance</span>
                <h1 className="text-xl font-display font-black text-secondary tracking-tight">ANNUAL DUES CLEARANCE CERTIFICATE</h1>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed font-light">
                  This is to officially certify that <strong className="text-secondary font-black">{currentStudent.fullName}</strong> with Matric Number <strong className="text-secondary font-bold">{currentStudent.matricNumber}</strong> in the Department of <strong className="text-secondary font-bold">{currentStudent.department} Engineering</strong> ({currentStudent.level}) has cleared all outstanding NAPES chapter dues of <strong className="text-primary font-bold">₦5,000</strong> for the <strong className="text-secondary font-bold">2025/2026</strong> academic session.
                </p>
              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-4">
                <div className="text-left space-y-1">
                  <span className="text-[7px] text-slate-400 uppercase tracking-widest block">Reference ID</span>
                  <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">{transactions[0]?.reference || 'NP-CLEARANCE'}</span>
                </div>

                {/* Simulated signature stamp */}
                <div className="relative pr-6">
                  <div className="w-16 h-16 border-2 border-red-500/80 rounded-full border-dashed flex items-center justify-center rotate-12 text-center text-red-500/80 font-black text-[7px] tracking-tighter absolute -top-8 right-2 select-none pointer-events-none opacity-80 uppercase leading-none">
                    NAPES<br />VERIFIED<br />STAMP
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[7px] text-slate-400 uppercase tracking-widest block">Authorized Signatory</span>
                    <span className="text-[9px] font-bold text-slate-800 block">Engr. Samson Beloved</span>
                    <span className="text-[7px] text-slate-400 block">Technical Committee Secretary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP: MOCK PAYSTACK CHECKOUT GATEWAY */}
      {checkoutOpen && currentStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full text-white shadow-2xl relative overflow-hidden">
            {/* Paystack logo bar */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-black uppercase tracking-wider">Paystack Secured Checkout</span>
              </div>
              <button 
                onClick={() => setCheckoutOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
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
                  className="space-y-5"
                >
                  <div className="text-center mb-6">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400">Paying dues to</span>
                    <h3 className="font-display font-black text-lg text-white">NAPES Yabatech Council</h3>
                    <div className="text-2xl font-black text-emerald-400 mt-2">₦5,000.00</div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\W/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider font-bold text-slate-400 ml-1">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg shadow-emerald-500/10 mt-6"
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
                  className="space-y-5"
                >
                  <div className="text-center mb-6">
                    <h3 className="font-display font-black text-lg text-white">Enter OTP Code</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
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
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-black tracking-[0.5em] text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg shadow-emerald-500/10 mt-6"
                  >
                    Authorize ₦5,000.00
                  </button>
                </motion.form>
              )}

              {/* STEP 3: PROCESSING SPREE */}
              {paymentStep === 'processing' && (
                <motion.div 
                  key="processing-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <Loader2 size={48} className="animate-spin text-emerald-400 mx-auto" />
                  <h3 className="font-display font-black text-lg">Verifying with Bank...</h3>
                  <p className="text-xs text-slate-400 font-light">Processing mock card authorization token.</p>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS! */}
              {paymentStep === 'success' && (
                <motion.div 
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto shadow-inner animate-pulse">
                    <CheckCircle size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-xl text-white">Payment Successful</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Mock payment processed. Dues reference cleared. Clearance certificate is now unlocked!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutOpen(false);
                      setActiveTab('payments');
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4.5 rounded-xl transition-all text-xs tracking-wider uppercase"
                  >
                    Return to Portal
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
