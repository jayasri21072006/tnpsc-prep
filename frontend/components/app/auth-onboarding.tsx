import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LockKey,
  EnvelopeSimple,
  UserCircle,
  CaretRight,
  ShieldCheck,
  CheckCircle,
  MagnifyingGlass,
  GraduationCap,
} from '@phosphor-icons/react/dist/ssr';
import { ALL_TN_EXAMS } from '@/lib/exam-data';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetExam: string;
  targetYear: string;
  medium: 'Tamil' | 'English' | 'Bilingual';
  dailyHours: string;
}

const ALL_EXAM_OPTIONS = [
  // TNPSC Exams
  { name: 'TNPSC Group 4 & VAO', category: 'TNPSC' },
  { name: 'TNPSC Group 2 / 2A', category: 'TNPSC' },
  { name: 'TNPSC Group 1', category: 'TNPSC' },
  { name: 'TNPSC Group 3 & 3A', category: 'TNPSC' },
  { name: 'TNPSC Combined Engineering Services (CESE)', category: 'TNPSC' },
  { name: 'TNPSC Combined Technical Services (CTSE)', category: 'TNPSC' },
  { name: 'TNPSC Combined Statistical Services (CSSE)', category: 'TNPSC' },
  { name: 'TNPSC Assistant System Engineer / Computer Exam', category: 'TNPSC' },
  { name: 'TNPSC Agricultural Officer / Horticulture', category: 'TNPSC' },
  
  // Police & Uniformed Services
  { name: 'TNUSRB Sub-Inspector of Police', category: 'TNUSRB Police' },
  { name: 'TNUSRB Police Constable (PC)', category: 'TNUSRB Police' },
  { name: 'TNUSRB Technical SI / Fingerprint SI', category: 'TNUSRB Police' },
  { name: 'TN Forest Guard / Forester (TNFUSRC)', category: 'Uniformed' },

  // Teachers Recruitment Board
  { name: 'TRB Teachers Eligibility Test (TNTET)', category: 'TRB Teaching' },
  { name: 'TRB Post Graduate Assistants (PG TRB)', category: 'TRB Teaching' },
  { name: 'TRB Block Educational Officer (BEO)', category: 'TRB Teaching' },
  { name: 'TRB Assistant Professors (Govt Arts & Science)', category: 'TRB Teaching' },
  { name: 'TRB Polytechnic Lecturers / Engineering Colleges', category: 'TRB Teaching' },
  { name: 'TRB Special Teachers (Physical / Art / Music)', category: 'TRB Teaching' },

  // Technical & Public Sector
  { name: 'TNEB / TANGEDCO Assistant Engineer (AE)', category: 'Technical' },
  { name: 'TNEB Assessor / Junior Assistant Accounts', category: 'Technical' },
  { name: 'Madras High Court Recruitment', category: 'Judiciary' },
  { name: 'Madras High Court Judicial Service / Civil Judge', category: 'Judiciary' },
  { name: 'TN MRB (Medical Services Recruitment Board)', category: 'Healthcare' },
  { name: 'Aavin Recruitment', category: 'Co-operatives' },
  { name: 'Tamil Nadu Housing Board (TNHB) / Slum Clearance', category: 'State Board' },
  { name: 'TN Labour Dept / Inspector of Factories', category: 'State Board' },
];

export function AuthOnboarding({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    id: 'TN-' + Math.floor(100000 + Math.random() * 900000),
    name: '',
    email: '',
    password: '',
    targetExam: 'TNPSC Group 4 & VAO',
    targetYear: '2025 - 2026',
    medium: 'Bilingual' as 'Tamil' | 'English' | 'Bilingual',
    dailyHours: '3 Hours/Day',
  });

  const categories = ['All', 'TNPSC', 'TNUSRB Police', 'TRB Teaching', 'Technical', 'Judiciary', 'Healthcare', 'Co-operatives'];

  const filteredExams = ALL_EXAM_OPTIONS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      id: formData.id,
      name: formData.name || 'Aspirant',
      email: formData.email,
      targetExam: formData.targetExam,
      targetYear: formData.targetYear,
      medium: formData.medium,
      dailyHours: formData.dailyHours,
    };
    try {
      localStorage.setItem('tn_exammate_user', JSON.stringify(finalProfile));
    } catch {
      // ignore
    }
    onComplete(finalProfile);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#E2E8F0] p-4 text-slate-900 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-2xl md:p-10"
      >
        <div className="absolute top-0 left-0 h-2 w-full bg-blue-600"></div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-800 border border-blue-200">
              <GraduationCap weight="duotone" className="text-2xl" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">TN ExamMate OS</h1>
              <p className="text-xs font-semibold text-slate-600">AI Preparation Platform for Tamil Nadu Govt Exams</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              1
            </div>
            <div className="h-0.5 w-6 bg-slate-300"></div>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-all ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              2
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Aspirant Account</h2>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  Set up your login credentials to unlock personalized AI study plans and mock tests.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800">
                    Full Name / Aspirant Name
                  </label>
                  <div className="relative">
                    <UserCircle weight="bold" className="absolute top-1/2 left-3.5 -translate-y-1/2 text-xl text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jayasri / Selvan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-xs font-bold text-slate-900 placeholder-slate-500 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeSimple weight="bold" className="absolute top-1/2 left-3.5 -translate-y-1/2 text-xl text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. aspirant@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-xs font-bold text-slate-900 placeholder-slate-500 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800">
                    Password Setup
                  </label>
                  <div className="relative">
                    <LockKey weight="bold" className="absolute top-1/2 left-3.5 -translate-y-1/2 text-xl text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-3 pr-4 pl-11 text-xs font-bold text-slate-900 placeholder-slate-500 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800">
                      Study Medium
                    </label>
                    <div className="flex rounded-xl border-2 border-slate-300 bg-slate-100 p-1">
                      {(['Tamil', 'English', 'Bilingual'] as const).map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setFormData({ ...formData, medium: m })}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-black transition-all ${
                            formData.medium === m ? 'bg-white text-blue-900 shadow-sm border border-slate-300' : 'text-slate-700 hover:text-slate-950'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800">
                      Daily Target
                    </label>
                    <select
                      value={formData.dailyHours}
                      onChange={(e) => setFormData({ ...formData, dailyHours: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-2.5 px-3 text-xs font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
                    >
                      <option>2 Hours/Day (Working Professional)</option>
                      <option>3 Hours/Day (Balanced)</option>
                      <option>5+ Hours/Day (Full Time Aspirant)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.email || !formData.password}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-black text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Select Target Exam <CaretRight weight="bold" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Target Exam</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-black text-blue-700 hover:underline"
                  >
                    ← Edit Credentials
                  </button>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  Select your primary TN Government exam. Your dashboard, syllabus, PYQs, and AI coach will adapt instantly.
                </p>
              </div>

              {/* Search & Category Filter */}
              <div className="mb-4 space-y-2.5">
                <div className="relative">
                  <MagnifyingGlass weight="bold" className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search all TN Govt exams (e.g. Group 4, SI, TRB, TNEB, MHC)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-300 bg-slate-50 py-2.5 pr-4 pl-9 text-xs font-bold text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-black transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exams Grid */}
              <div className="mb-6 max-h-60 space-y-2 overflow-y-auto pr-1">
                {filteredExams.map((exam) => {
                  const isSelected = formData.targetExam === exam.name;
                  return (
                    <button
                      key={exam.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, targetExam: exam.name })}
                      className={`flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-950 shadow-xs font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 hover:bg-white'
                      }`}
                    >
                      <div>
                        <span className="block text-xs font-bold leading-tight">
                          {exam.name}
                        </span>
                        <span className="mt-0.5 inline-block text-[11px] font-bold text-slate-600">
                          {exam.category}
                        </span>
                      </div>
                      {isSelected ? (
                        <CheckCircle weight="fill" className="text-xl text-blue-600" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-400"></div>
                      )}
                    </button>
                  );
                })}

                {filteredExams.length === 0 && (
                  <div className="py-6 text-center text-xs font-bold text-slate-500">
                    No matching exams found. Try clearing your search.
                  </div>
                )}
              </div>

              {/* Confirm & Launch Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-black text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700"
              >
                <ShieldCheck weight="fill" className="text-lg" />
                Launch {formData.targetExam} Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
