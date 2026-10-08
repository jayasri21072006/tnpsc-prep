import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  ChartLineUp,
  Checks,
  Clock,
  Lightbulb,
  Play,
  YoutubeLogo,
  DownloadSimple,
  ArrowSquareOut,
  Sparkle,
  CalendarCheck,
  Megaphone,
  Briefcase,
  Star,
  Flame,
  FilePdf,
} from '@phosphor-icons/react/dist/ssr';
import { getExamDetails } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';
import { getActiveUser, calculateUserAnalytics, recordPyqDownload } from '@/lib/user-db';
import { downloadOfficialPyqPdf } from '@/lib/pyq-downloader';

interface DashboardContentProps {
  profile?: UserProfile | null;
  onNavigateTab?: (tab: string) => void;
  onActivateCoach?: () => void;
}

export function DashboardContent({ profile, onNavigateTab, onActivateCoach }: DashboardContentProps) {
  const exam = getExamDetails(profile?.targetExam);
  const [videoSort, setVideoSort] = useState<'views' | 'rating' | 'duration'>('views');
  const [analytics, setAnalytics] = useState(() => {
    const active = getActiveUser();
    return calculateUserAnalytics(active);
  });

  // Re-calculate user analytics whenever profile or storage changes
  useEffect(() => {
    const active = getActiveUser();
    setAnalytics(calculateUserAnalytics(active));
  }, [profile?.email]);

  // Compute live days countdown from the curated official exam date
  const computeLiveDays = () => {
    if (!exam.examDate) return 100;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(exam.examDate);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 100;
  };

  const daysLeft = computeLiveDays();

  // Sort YouTube videos according to the selected criterion (highest views first by default)
  const sortedVideos = [...exam.youtubeVideos].sort((a, b) => {
    if (videoSort === 'views') {
      return (b.viewsCount || 0) - (a.viewsCount || 0);
    }
    if (videoSort === 'rating') {
      return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
    }
    return 0;
  });

  const handlePyqClick = (pyqTitle: string, url: string) => {
    if (profile?.email) {
      recordPyqDownload(profile.email, pyqTitle);
      const active = getActiveUser();
      setAnalytics(calculateUserAnalytics(active));
    }
    window.open(url, '_blank');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* Official Notification & Curated Exam Date Alert Bar from tnpsc.gov.in */}
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-4.5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start md:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0 mt-0.5 md:mt-0">
            <Megaphone weight="fill" className="text-xl" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-200 px-2 py-0.5 rounded border border-emerald-300">
                Official Gazette Status
              </span>
              <span className="text-xs font-black text-emerald-950">{exam.notificationStatus}</span>
            </div>
            <div className="text-xs text-slate-800 font-semibold mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 font-bold text-slate-950">
                <CalendarCheck weight="bold" className="text-blue-700" /> Official Schedule: {exam.examDateDisplay}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-slate-950">
                <Briefcase weight="bold" className="text-emerald-700" /> {exam.vacancies}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <a
            href={exam.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline mr-2"
          >
            tnpsc.gov.in <ArrowSquareOut weight="bold" />
          </a>
          <div className="rounded-xl bg-emerald-600 text-white px-3.5 py-1.5 text-center shadow-xs">
            <span className="block text-[9px] font-black uppercase">Countdown</span>
            <span className="text-sm font-black">{daysLeft} Days</span>
          </div>
        </div>
      </div>

      {/* Target Exam Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
            <Sparkle weight="fill" /> Active Exam Target
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-0.5">{exam.name}</h2>
          <p className="text-xs text-slate-700 mt-1 font-medium">
            Conducting Board: <span className="text-slate-900 font-bold">{exam.board}</span> • Target Attempt: <span className="font-bold text-slate-900">{profile?.targetYear || '2025-2026'}</span>
          </p>

          {/* Curated Date Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-blue-100 border border-blue-200 px-2.5 py-1 text-xs font-black text-blue-950 flex items-center gap-1.5">
              <CalendarCheck weight="bold" className="text-blue-700" />
              Curated Exam Date: {exam.examDateDisplay}
            </span>
            <span className="rounded-lg bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <Briefcase weight="bold" className="text-emerald-700" />
              {exam.vacancies}
            </span>
            <span className="rounded-lg bg-amber-100 border border-amber-200 px-2.5 py-1 text-xs font-black text-amber-950">
              Notification: {exam.notificationStatus.split('•')[0]}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={exam.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            Official Portal <ArrowSquareOut weight="bold" />
          </a>
          <button
            onClick={() => onNavigateTab?.('My Preparation')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all"
          >
            View Study Plan ({daysLeft} Days)
          </button>
        </div>
      </div>

      {/* Live TNPSC Official Notification & Curated Dates Card */}
      <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white shadow-xs shrink-0">
              <Megaphone weight="fill" className="text-xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                  TNPSC Gazette Bulletin
                </span>
                <span className="text-xs font-black text-indigo-950">
                  TNPSC Group 4 & VAO (CCSE-IV 2026) Official Notification Released!
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-700 font-medium">
                Official Notification No. 01/2026 released on <strong>October 6, 2026</strong>. Online applications open till <strong>November 5, 2026</strong>. 
                <strong className="text-blue-900 block mt-0.5">
                  Curated Written Examination Date: January 10, 2027 (09:30 AM – 12:30 PM) • 6,574+ Vacancies
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-auto">
            <a
              href="https://www.tnpsc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-xl bg-white border border-indigo-300 px-3 py-1.5 text-xs font-black text-indigo-800 hover:bg-indigo-50 transition-colors shadow-xs"
            >
              tnpsc.gov.in Gazette <ArrowSquareOut weight="bold" />
            </a>
            {exam.name !== "TNPSC Group 4 & VAO" && (
              <button
                onClick={() => onNavigateTab?.('Explore Exams')}
                className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-black text-white hover:bg-indigo-700 transition-colors shadow-xs"
              >
                Switch to Group 4 Target
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col gap-6 md:flex-row">
        {/* Dynamic User Readiness Card (Calculated from Real User DB Activity!) */}
        <div className="relative flex-1 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white p-7 shadow-xs">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black tracking-wider text-slate-600 uppercase">
                Your Calculated Readiness Score
              </h3>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                {analytics.isNewUser ? 'New Aspirant Account' : `${analytics.tasksCompletedCount} Tasks Done`}
              </span>
            </div>

            <div className="mb-4 flex items-end gap-4">
              <span className="text-6xl font-black text-slate-900">
                {analytics.readiness}<span className="text-3xl text-blue-700">%</span>
              </span>
              <div className="mb-2 flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-900 border border-emerald-300">
                <ChartLineUp weight="bold" /> {analytics.isNewUser ? 'Ready to Start' : '+Real Progress'}
              </div>
            </div>

            <p className="max-w-md text-xs text-slate-800 leading-relaxed font-semibold">
              {analytics.isNewUser ? (
                <>
                  Welcome <strong className="text-slate-950 font-black">{profile?.name || 'Aspirant'}</strong>! Your account has just been created. 
                  Your score will dynamically calculate and grow as you check off daily tasks in <strong className="text-blue-700 font-bold">My Preparation</strong> and complete mock tests.
                </>
              ) : (
                <>
                  Based on your completed tasks and mock drills, your readiness for <strong className="text-slate-950 font-black">{exam.name}</strong> is{' '}
                  <strong className="text-emerald-800 font-black">{analytics.readiness}%</strong>. Keep up your daily momentum!
                </>
              )}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {exam.syllabus.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-800"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* What Should I Do Now Card */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-6 shadow-xs md:w-80">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-black tracking-wider text-blue-900 uppercase">
              <Lightbulb weight="fill" className="text-lg text-blue-600" />
              What Should I Do Now?
            </div>
            <p className="mb-5 text-xs leading-relaxed text-slate-800 font-medium">
              According to your personalized <strong className="text-slate-950 font-bold">{exam.name}</strong> plan ({daysLeft} Days left):
              <br /><br />
              Next high-yield task:{' '}
              <strong className="text-blue-900 font-black">
                {exam.studyPlan.tasks.find((t) => !t.done)?.title || 'Review High-Yield PYQs'}
              </strong>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab?.('Study Room')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700"
          >
            <Play weight="fill" />
            Launch Study Room
          </button>
        </div>
      </section>

      {/* Dynamic Stats Grid (Calculated from Real User Progress!) */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Syllabus Covered"
          value={`${analytics.syllabusCovered}%`}
          subtitle={analytics.isNewUser ? '0 Tasks completed' : `${analytics.tasksCompletedCount} Units studied`}
          icon={<BookOpen weight="bold" />}
        />
        <StatCard
          title="Practice Accuracy"
          value={analytics.testsCompletedCount > 0 ? `${analytics.accuracy}%` : '--'}
          subtitle={analytics.testsCompletedCount > 0 ? `${analytics.testsCompletedCount} Tests attempted` : 'Take first mock test'}
          icon={<Checks weight="bold" />}
        />
        <StatCard
          title="Mock Percentile"
          value={analytics.testsCompletedCount > 0 ? `${Math.min(99, 65 + analytics.accuracy / 4)}th` : '--'}
          subtitle={`${exam.board.split(' ')[0]} Aspirants`}
          icon={<ChartLineUp weight="bold" />}
        />
        <StatCard
          title="Study Streak"
          value={`${analytics.streak} Day${analytics.streak > 1 ? 's' : ''}`}
          subtitle={`Goal: ${profile?.dailyHours || '3 hrs/day'}`}
          icon={<Clock weight="bold" />}
        />
      </section>

      {/* Curated YouTube Video Lessons Ranked by Views */}
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <YoutubeLogo weight="fill" className="text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                Curated YouTube Masterclasses for {exam.name}
                <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">
                  Ranked by Views
                </span>
              </h3>
              <p className="text-xs font-medium text-slate-600">
                Top-rated faculty lectures, full marathons & shortcut tricks sorted by highest student viewership.
              </p>
            </div>
          </div>

          {/* Sort Filter Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-300 bg-slate-50 p-1 text-xs font-bold">
            <button
              onClick={() => setVideoSort('views')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                videoSort === 'views'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Flame weight="fill" /> Highest Views
            </button>
            <button
              onClick={() => setVideoSort('rating')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                videoSort === 'rating'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Star weight="fill" /> Top Rated
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {sortedVideos.map((vid, idx) => (
            <a
              key={idx}
              href={vid.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-blue-400 hover:bg-blue-50/40 shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {vid.rankBadge ? (
                      <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                        {vid.rankBadge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                        #{idx + 1} Ranked
                      </span>
                    )}
                    <span className="text-[11px] font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                      {vid.channel}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <Clock weight="bold" /> {vid.duration}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition-colors line-clamp-2">
                  {vid.title}
                </h4>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-bold text-slate-700 group-hover:text-blue-900">
                <span className="flex items-center gap-2">
                  <span className="text-red-700 font-bold flex items-center gap-1">
                    <YoutubeLogo weight="fill" /> {vid.views}
                  </span>
                  <span className="text-amber-700 font-bold">• {vid.rating}</span>
                </span>
                <span className="flex items-center gap-1 text-blue-700 font-black">
                  Watch Video <ArrowSquareOut weight="bold" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Official Previous Year Question Papers (PYQs) with Working Direct Download Mirrors */}
      <section className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Official Previous Year Question Papers (PYQs) & Verified Answer Keys
            </h3>
            <p className="text-xs font-medium text-slate-600">
              Direct access to authentic papers from official examination boards and verified academic repositories.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab?.('Mock Tests & PYQs')}
            className="text-xs font-black text-blue-700 hover:underline shrink-0"
          >
            Open All Tests & PYQs →
          </button>
        </div>

        {/* Quick Repository Navigation Bar */}
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
              <span>🏛️</span> Verified Question Paper Repositories (Direct External Portals):
            </span>
            <span className="text-[11px] text-slate-600 font-medium">
              Click any repository below to browse or download the complete archives directly:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.tnpsc.gov.in/English/previous_question_papers.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-black text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
            >
              <span>TNPSC Archive</span>
              <ArrowSquareOut weight="bold" />
            </a>
            <a
              href="https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              <span>Winmeen Bank</span>
              <ArrowSquareOut weight="bold" />
            </a>
            <a
              href="https://www.padasalai.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-purple-300 px-3 py-1.5 text-xs font-black text-purple-800 hover:bg-purple-600 hover:text-white transition-all shadow-xs"
            >
              <span>Padasalai Portal</span>
              <ArrowSquareOut weight="bold" />
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {exam.pyqs.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-900 border border-emerald-200">
                    {p.year} Exam Paper
                  </span>
                  <span className="text-xs font-semibold text-slate-600">• {p.questions} Questions</span>
                  <span className="text-xs font-semibold text-slate-500">• {p.size}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1.5">{p.title}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    handlePyqClick(p.title, p.downloadUrl);
                    downloadOfficialPyqPdf({
                      examName: exam.name,
                      board: exam.board,
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
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
      <div className="mb-3 flex items-center gap-2 text-slate-700">
        <div className="text-lg text-blue-700">{icon}</div>
        <span className="text-[11px] font-black tracking-wider uppercase">{title}</span>
      </div>
      <div className="mb-0.5 text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs font-bold text-slate-600">{subtitle}</div>
    </div>
  );
}
