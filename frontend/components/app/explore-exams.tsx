import React, { useState } from 'react';
import {
  Books,
  Target,
  TrendUp,
  MagnifyingGlass,
  ArrowSquareOut,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr';
import { ALL_TN_EXAMS } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';

interface ExploreExamsProps {
  profile?: UserProfile | null;
  onSelectTargetExam?: (examName: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export function ExploreExams({
  profile,
  onSelectTargetExam,
  onNavigateTab,
}: ExploreExamsProps) {
  const [search, setSearch] = useState('');
  const examList = Object.values(ALL_TN_EXAMS);

  const filteredExams = examList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.board.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkle weight="fill" /> Tamil Nadu State Recruitment Catalog
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Explore All Government Exams</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover official syllabi, board notification links, and switch your active prep target anytime.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <MagnifyingGlass className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter exams by name or board..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-4 pl-9 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Exams */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredExams.map((exam) => {
          const isCurrent = profile?.targetExam === exam.name;
          return (
            <div
              key={exam.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                isCurrent
                  ? 'border-blue-500 bg-blue-50/40 shadow-md shadow-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      {exam.board}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{exam.name}</h3>
                  </div>
                  {isCurrent && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                      <CheckCircle weight="fill" /> Active Target
                    </span>
                  )}
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge icon={<Target />} text={exam.category} />
                  <Badge icon={<TrendUp />} text={`Plan: ${exam.duration}`} />
                  <a
                    href={exam.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-blue-900"
                  >
                    Official Portal <ArrowSquareOut />
                  </a>
                </div>

                {/* Curated Date & Notification Notice */}
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                    📅 Schedule: {exam.examDateDisplay}
                  </span>
                  <span className="font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                    👥 {exam.vacancies.split(' ')[0]} Vacancies
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 truncate">
                    📢 {exam.notificationStatus}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Books /> Official Syllabus Units
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {exam.syllabus.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                {isCurrent ? (
                  <button
                    onClick={() => onNavigateTab?.('Dashboard')}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors text-center shadow-xs"
                  >
                    Go to Your Dashboard
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectTargetExam?.(exam.name)}
                    className="flex-1 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-800 hover:bg-blue-600 hover:text-white transition-all text-center border border-slate-200"
                  >
                    Set as My Target Exam & Prepare
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
      <span className="text-slate-500">{icon}</span>
      {text}
    </div>
  );
}
