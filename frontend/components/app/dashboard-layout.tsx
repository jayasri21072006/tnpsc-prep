'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  BookOpen,
  Bookmark,
  Brain,
  ChartBar,
  FileText,
  Layout,
  MagnifyingGlass,
  Target,
  CaretDown,
  SignOut,
  ArrowsClockwise,
  CheckCircle,
  DownloadSimple,
  FilePdf,
  ArrowSquareOut,
  X,
} from '@phosphor-icons/react/dist/ssr';
import { UserProfile } from './auth-onboarding';
import { ALL_TN_EXAMS, getExamDetails } from '@/lib/exam-data';
import { recordPyqDownload } from '@/lib/user-db';
import { downloadOfficialPyqPdf } from '@/lib/pyq-downloader';

export function getExamShortLabel(name: string): string {
  if (!name) return 'Target Exam';
  if (name.includes('Group 4')) return 'TNPSC Group 4';
  if (name.includes('Group 2')) return 'TNPSC Group 2';
  if (name.includes('Group 1')) return 'TNPSC Group 1';
  if (name.includes('TNHB') || name.includes('Housing Board') || name.includes('Slum')) return 'TNHB Housing';
  if (name.includes('Police') || name.includes('TNUSRB') || name.includes('Sub-Inspector')) return 'TN Police SI';
  if (name.includes('TRB') || name.includes('TET')) return 'TRB Teachers';
  if (name.includes('High Court') || name.includes('MHC')) return 'Madras High Court';
  if (name.includes('TNEB') || name.includes('TANGEDCO')) return 'TNEB AE';
  if (name.includes('MRB')) return 'TN MRB Health';
  if (name.includes('Forest')) return 'TNFUSRC Forest';
  if (name.includes('Aavin')) return 'Aavin Dairy';
  return name.length > 18 ? name.slice(0, 16) + '...' : name;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  onActivateCoach?: () => void;
  isCoachActive?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  profile?: UserProfile | null;
  onLogout?: () => void;
  onChangeTarget?: (newExam: string) => void;
}

export function DashboardLayout({
  children,
  onActivateCoach,
  isCoachActive,
  activeTab = 'Dashboard',
  onTabChange,
  profile,
  onLogout,
  onChangeTarget,
}: DashboardLayoutProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showPyqSidebarModal, setShowPyqSidebarModal] = useState(false);
  const [selectedPyqExam, setSelectedPyqExam] = useState<string>(profile?.targetExam || 'TNPSC Group 4 & VAO');

  const availableExams = Object.keys(ALL_TN_EXAMS);
  const currentExam = getExamDetails(profile?.targetExam);
  const activePyqExam = getExamDetails(selectedPyqExam || profile?.targetExam);

  useEffect(() => {
    if (profile?.targetExam) {
      setSelectedPyqExam(profile.targetExam);
    }
  }, [profile?.targetExam]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F1F5F9] font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="hidden w-64 flex-col border-r border-slate-300 bg-white md:flex shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h1 className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <BookOpen weight="bold" />
            </span>
            TN ExamMate
          </h1>
          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 border border-blue-200">
            <span className="text-xs font-bold text-blue-900 truncate max-w-[140px]">
              🎯 {profile?.targetExam || 'TNPSC Group 4'}
            </span>
            <button
              onClick={() => setShowTargetModal(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-950 underline cursor-pointer"
            >
              Switch
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <NavItem
            icon={<Layout weight="bold" />}
            label="Dashboard"
            active={activeTab === 'Dashboard'}
            onClick={() => onTabChange?.('Dashboard')}
          />
          <NavItem
            icon={<Target weight="bold" />}
            label="My Preparation"
            active={activeTab === 'My Preparation'}
            onClick={() => onTabChange?.('My Preparation')}
          />
          <NavItem
            icon={<Bookmark weight="bold" />}
            label="Study Room"
            active={activeTab === 'Study Room'}
            onClick={() => onTabChange?.('Study Room')}
          />
          <NavItem
            icon={<FileText weight="bold" />}
            label="Mock Tests & PYQs"
            active={activeTab === 'Mock Tests & PYQs'}
            onClick={() => onTabChange?.('Mock Tests & PYQs')}
          />
          <NavItem
            icon={<ChartBar weight="bold" />}
            label="Progress Intelligence"
            active={activeTab === 'Progress Intelligence'}
            onClick={() => onTabChange?.('Progress Intelligence')}
          />
          <NavItem
            icon={<MagnifyingGlass weight="bold" />}
            label="Explore All Exams"
            active={activeTab === 'Explore Exams'}
            onClick={() => onTabChange?.('Explore Exams')}
          />
          <NavItem
            icon={<Bell weight="bold" />}
            label="Govt Notifications"
            active={activeTab === 'Govt Notifications'}
            onClick={() => onTabChange?.('Govt Notifications')}
          />

          {/* Quick PYQ Download Section along the sidebar */}
          <div className="pt-3 border-t border-slate-200 mt-2 space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-1">
              Official Past Papers (PYQ)
            </div>

            {/* Target Exam PYQs */}
            <button
              onClick={() => {
                setSelectedPyqExam(currentExam.name);
                setShowPyqSidebarModal(true);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50/90 px-3 py-2 text-xs font-black text-blue-900 hover:bg-blue-100 transition-all shadow-xs"
            >
              <span className="flex items-center gap-2 truncate">
                <FilePdf weight="fill" className="text-red-600 text-base shrink-0" />
                <span className="truncate">{getExamShortLabel(currentExam.name)} PYQs</span>
              </span>
              <DownloadSimple weight="bold" className="shrink-0" />
            </button>

            {/* Direct TNPSC Group 4 shortcut if target is not Group 4 */}
            {currentExam.name !== 'TNPSC Group 4 & VAO' && (
              <button
                onClick={() => {
                  setSelectedPyqExam('TNPSC Group 4 & VAO');
                  setShowPyqSidebarModal(true);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-xs font-black text-emerald-950 hover:bg-emerald-100 transition-all shadow-xs"
              >
                <span className="flex items-center gap-2 truncate">
                  <FilePdf weight="fill" className="text-emerald-600 text-base shrink-0" />
                  <span className="truncate">TNPSC Group 4 PYQs</span>
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold shrink-0">Official</span>
              </button>
            )}

            {/* All Papers Repository Button */}
            <button
              onClick={() => {
                setSelectedPyqExam(currentExam.name);
                setShowPyqSidebarModal(true);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:text-blue-800 hover:bg-slate-100 py-1 transition-colors"
            >
              <span>Browse All TN State PYQs →</span>
            </button>
          </div>
        </nav>

        {/* LiveKit attribution cleanly placed inside sidebar bottom */}
        <div className="px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-bold">
          <span>LiveKit AI Ready</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs"></span>
        </div>

        <div className="p-4 pt-1">
          <button
            onClick={onActivateCoach}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-xs shadow-md transition-all ${
              isCoachActive
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            <Brain weight="bold" className="text-base" />
            {isCoachActive ? 'AI Coach Active' : 'Start Voice AI Coach'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#F1F5F9]">
        {/* Header */}
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-300 bg-white px-6 shadow-xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-slate-900 md:text-lg">{activeTab}</h2>
            <span className="hidden sm:inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-900 border border-blue-200">
              {profile?.targetExam || 'Tamil Nadu Govt Exam'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick PYQ Header Trigger */}
            <button
              onClick={() => setShowPyqSidebarModal(true)}
              className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-white transition-colors"
            >
              <FilePdf weight="fill" className="text-red-600" /> PYQ Archive
            </button>

            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {profile?.medium || 'Bilingual'} Medium • {profile?.dailyHours || '3 hrs/day'}
            </div>

            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-1.5 pr-3 text-xs font-bold text-slate-900 transition-colors hover:border-slate-400 hover:bg-slate-50 shadow-xs"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="hidden md:inline font-bold text-slate-900">{profile?.name || 'Aspirant'}</span>
                <CaretDown weight="bold" className="text-slate-600" />
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border-2 border-slate-300 bg-white p-4 shadow-2xl z-50 text-slate-900"
                  >
                    <div className="border-b border-slate-200 pb-3 mb-3">
                      <div className="font-black text-slate-900 text-sm">{profile?.name || 'Aspirant'}</div>
                      <div className="text-xs font-medium text-slate-600 truncate">{profile?.email || 'aspirant@exammate.tn'}</div>
                      <div className="mt-2 inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-200">
                        ID: {profile?.id || 'TN-102938'}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs font-bold">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowTargetModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <ArrowsClockwise weight="bold" className="text-blue-600 text-base" />
                        Switch Target Exam
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowPyqSidebarModal(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-blue-800 hover:bg-blue-50 transition-colors"
                      >
                        <FilePdf weight="fill" className="text-red-600 text-base" />
                        Download Target PYQs
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout?.();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-rose-700 hover:bg-rose-50 transition-colors"
                      >
                        <SignOut weight="bold" className="text-rose-600 text-base" />
                        Log Out / Change Account
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
      </main>

      {/* Quick PYQ Download Sidebar Modal with Working External Mirrors */}
      <AnimatePresence>
        {showPyqSidebarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border-2 border-slate-300 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-red-100 text-red-600">
                    <FilePdf weight="fill" className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Previous Year Papers: {activePyqExam.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Authentic question papers and master keys from {activePyqExam.board}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPyqSidebarModal(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X weight="bold" className="text-lg" />
                </button>
              </div>

              {/* Exam Tabs inside Modal */}
              <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {availableExams.map((ex) => {
                  const isSelected = activePyqExam.name === ex;
                  return (
                    <button
                      key={ex}
                      onClick={() => setSelectedPyqExam(ex)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {getExamShortLabel(ex)}
                    </button>
                  );
                })}
              </div>

              {/* Direct Working External Archives Quick Navigation */}
              <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-blue-900 mb-2">
                  Direct Working Question Paper Portals:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="https://www.tnpsc.gov.in/English/previous_question_papers.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-white border border-blue-300 px-2.5 py-1.5 font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                  >
                    <span>🏛️ TNPSC Official Archive</span>
                    <ArrowSquareOut weight="bold" />
                  </a>
                  <a
                    href="https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-white border border-emerald-300 px-2.5 py-1.5 font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
                  >
                    <span>📑 Winmeen Question Bank</span>
                    <ArrowSquareOut weight="bold" />
                  </a>
                  <a
                    href="https://www.padasalai.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-white border border-purple-300 px-2.5 py-1.5 font-bold text-purple-800 hover:bg-purple-600 hover:text-white transition-all shadow-xs"
                  >
                    <span>📚 Padasalai Exam Circle</span>
                    <ArrowSquareOut weight="bold" />
                  </a>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 mb-5">
                {activePyqExam.pyqs.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-900 border border-emerald-200">
                          {p.year} Exam Paper
                        </span>
                        <span className="text-xs font-semibold text-slate-600">• {p.questions} Qs</span>
                        <span className="text-xs font-semibold text-slate-500">• {p.size}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{p.title}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (profile?.email) recordPyqDownload(profile.email, p.title);
                          downloadOfficialPyqPdf({
                            examName: activePyqExam.name,
                            board: activePyqExam.board,
                            year: p.year,
                            title: p.title,
                            questionsCount: p.questions,
                            size: p.size,
                          });
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/30 cursor-pointer"
                      >
                        <DownloadSimple weight="bold" className="text-sm" /> Download PDF File
                      </button>

                      <a
                        href={p.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-white border border-blue-300 px-2.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-50 transition-colors shadow-xs"
                      >
                        <ArrowSquareOut weight="bold" /> Govt Portal
                      </a>

                      <a
                        href={p.winmeenUrl || "https://www.winmeen.com/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
                      >
                        <ArrowSquareOut weight="bold" className="text-emerald-600" /> Winmeen
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <a
                  href={activePyqExam.officialSite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                >
                  Open {activePyqExam.board.split(' ')[0]} Official Portal <ArrowSquareOut weight="bold" />
                </a>

                <button
                  onClick={() => setShowPyqSidebarModal(false)}
                  className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Target Exam Switcher Modal with Curated Dates */}
      <AnimatePresence>
        {showTargetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl border-2 border-slate-300 bg-white p-6 shadow-2xl"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Switch Your Target Exam</h3>
              <p className="text-xs font-medium text-slate-600 mb-4">
                Selecting a new exam will customize your dashboard, study plan, mock tests, and curated schedules instantly.
              </p>

              <div className="max-h-80 space-y-2 overflow-y-auto pr-1 mb-6">
                {availableExams.map((exam) => {
                  const isCurrent = profile?.targetExam === exam;
                  const details = getExamDetails(exam);
                  return (
                    <button
                      key={exam}
                      onClick={() => {
                        onChangeTarget?.(exam);
                        setShowTargetModal(false);
                      }}
                      className={`flex w-full items-start justify-between rounded-xl border-2 p-3 text-left transition-all ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-black'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-400 hover:bg-white font-bold'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black">{exam}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                            📅 {details.examDateDisplay}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            {details.vacancies.split(' ')[0]} Vacancies
                          </span>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle weight="fill" className="text-blue-600 text-xl shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowTargetModal(false)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
        active
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <span className={`text-base ${active ? 'text-white' : 'text-slate-600'}`}>{icon}</span>
      {label}
    </button>
  );
}
