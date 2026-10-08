import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Circle,
  Clock,
  Plus,
  CalendarCheck,
  Sparkle,
  Trash,
  DownloadSimple,
  CalendarBlank,
  FilePdf,
  ArrowSquareOut,
  Target,
  Megaphone,
} from '@phosphor-icons/react/dist/ssr';
import { getExamDetails } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';
import { recordTaskCompletion } from '@/lib/user-db';

export function MyPreparation({ profile }: { profile?: UserProfile | null }) {
  const exam = getExamDetails(profile?.targetExam);
  const [tasks, setTasks] = useState(exam.studyPlan.tasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [examDate, setExamDate] = useState<string>(exam.examDate || '');

  // Reset examDate when targetExam changes
  useEffect(() => {
    setExamDate(exam.examDate || '');
    setTasks(exam.studyPlan.tasks);
  }, [profile?.targetExam]);

  const calculateDays = () => {
    const targetDateStr = examDate || exam.examDate;
    if (!targetDateStr) return 100;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 100;
  };

  const daysRemaining = calculateDays();

  const toggleTask = (index: number) => {
    setTasks((prev) =>
      prev.map((t, i) => {
        if (i === index) {
          const newDone = !t.done;
          if (profile?.email) {
            recordTaskCompletion(profile.email, t.title, newDone);
          }
          return { ...t, done: newDone };
        }
        return t;
      })
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        title: newTaskTitle,
        time: newTaskTime || 'Flexible Time',
        done: false,
        subject: 'Custom Goal',
      },
    ]);
    setNewTaskTitle('');
    setNewTaskTime('');
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const scale = daysRemaining / 100;
  const d1 = Math.max(1, Math.round(1 * scale));
  const d30 = Math.max(d1, Math.round(30 * scale));
  const d31 = d30 + 1;
  const d70 = Math.max(d31, Math.round(70 * scale));
  const d71 = d70 + 1;
  const d90 = Math.max(d71, Math.round(90 * scale));
  const d91 = d90 + 1;
  const d100 = daysRemaining;

  const roadmapPhases = [
    {
      phase: 'Phase 1',
      dayRange: `Day ${d1} – Day ${d30}`,
      title: 'Foundation & Samacheer Kalvi Core (6th to 10th Std)',
      focus: 'General Science, Tamil Grammar, and Arithmetic fundamentals.',
      tasks: ['Samacheer 6th-8th Science & History', 'General Tamil Grammar basics', 'Aptitude: Simplification, Percentage, Ratio']
    },
    {
      phase: 'Phase 2',
      dayRange: `Day ${d31} – Day ${d70}`,
      title: 'Core Syllabus Mastery & High-Weightage Units',
      focus: `Master Unit 8 (TN History & Culture), Unit 9, Indian Polity & Economy for ${exam.name}.`,
      tasks: ['Unit 8 Sangam Literature & Thirukkural', 'Indian Polity & Constitution Articles', 'TN Administration & Social Welfare Schemes']
    },
    {
      phase: 'Phase 3',
      dayRange: `Day ${d71} – Day ${d90}`,
      title: 'PYQ Drills & Speed Practice',
      focus: `Solve last 7 years ${exam.board} question papers with timer.`,
      tasks: ['2018–2024 Question Papers solving', 'Speed aptitude drills (25/25 target)', 'Weak topic recovery sessions']
    },
    {
      phase: 'Phase 4',
      dayRange: `Day ${d91} – Day ${d100}`,
      title: 'Full-Length Simulation Mocks & Rapid Revision',
      focus: 'Simulate exact exam conditions (3 hrs, 200 Qs) with OMR practice.',
      tasks: ['3 Full-Length Mock Exams with analysis', 'Final formulas & timelines revision', 'Mental calm & exam day strategy']
    }
  ];

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download your Study Plan PDF.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>TN ExamMate — ${exam.name} ${daysRemaining}-Day Master Study Plan</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.45; padding: 15px; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 22px; font-weight: 900; color: #1e3a8a; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 3px; }
          .badge { background: #dbeafe; color: #1e40af; font-weight: 800; font-size: 11px; padding: 4px 10px; border-radius: 6px; }
          .meta-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px; }
          .meta-item strong { display: block; color: #475569; font-size: 10px; text-transform: uppercase; margin-bottom: 2px; }
          .meta-item span { font-weight: 800; color: #0f172a; font-size: 12px; }
          .phase-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 12px; page-break-inside: avoid; }
          .phase-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 6px; }
          .phase-title { font-size: 14px; font-weight: 800; color: #1e40af; }
          .phase-days { background: #dbeafe; color: #1e40af; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
          .phase-focus { font-size: 11px; color: #334155; margin-bottom: 6px; }
          .goals-list { margin: 0; padding-left: 18px; font-size: 11px; color: #1e293b; }
          .goals-list li { margin-bottom: 3px; }
          .footer { margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
          .btn-print { background: #2563eb; color: white; border: none; padding: 10px 18px; font-weight: 800; font-size: 12px; border-radius: 6px; cursor: pointer; margin-bottom: 15px; }
          @media print { .btn-print { display: none; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">📥 Click Here to Print / Save as PDF</button>
        
        <div class="header">
          <div>
            <h1 class="title">TN EXAMMATE — MASTER STUDY PLAN</h1>
            <div class="subtitle">Personalized Preparation Strategy for Tamil Nadu Government Examinations</div>
          </div>
          <div class="badge">${daysRemaining}-DAY ROADMAP</div>
        </div>

        <div class="meta-box">
          <div class="meta-item">
            <strong>Aspirant Name</strong>
            <span>${profile?.name || 'Aspirant'}</span>
          </div>
          <div class="meta-item">
            <strong>Target Exam</strong>
            <span>${exam.name}</span>
          </div>
          <div class="meta-item">
            <strong>Daily Commitment</strong>
            <span>${profile?.dailyHours || '3 hrs/day'} (${profile?.medium || 'Bilingual'})</span>
          </div>
          <div class="meta-item">
            <strong>Plan Target / Official Date</strong>
            <span>${examDate || exam.examDateDisplay} (${daysRemaining} Days)</span>
          </div>
        </div>

        <h3 style="font-size: 13px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase;">
          PHASE-BY-PHASE EXECUTION ROADMAP
        </h3>

        ${roadmapPhases.map(p => `
          <div class="phase-card">
            <div class="phase-header">
              <span class="phase-title">${p.phase}: ${p.title}</span>
              <span class="phase-days">${p.dayRange}</span>
            </div>
            <div class="phase-focus"><strong>Core Focus:</strong> ${p.focus}</div>
            <ul class="goals-list">
              ${p.tasks.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        `).join('')}

        <div class="footer">
          <span>Generated by TN ExamMate AI Coach • ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>Conducting Board: ${exam.board} • Portal: ${exam.officialSite}</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6">
      {/* Official Status Alert */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white">
            <Megaphone weight="fill" className="text-lg" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-950 flex items-center gap-2">
              <span className="bg-emerald-200 px-2 py-0.5 rounded uppercase text-[10px]">Official Notice</span>
              {exam.notificationStatus}
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              Official Schedule: <span className="text-blue-900">{exam.examDateDisplay}</span> • Vacancies: <span className="text-emerald-900">{exam.vacancies}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-emerald-900 bg-white border border-emerald-300 px-3 py-1.5 rounded-xl shadow-xs">
            {daysRemaining} Days Countdown Active
          </span>
        </div>
      </div>

      {/* Top Header & Countdown Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700">
            <Sparkle weight="fill" /> AI-Generated Master Roadmap & Strategy
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-0.5">My Preparation & Overall Study Plan</h2>
          <p className="text-xs text-slate-600 mt-1 font-semibold">
            Tailored for <strong className="text-slate-950 font-black">{exam.name}</strong> • Target Date: <strong className="text-blue-900">{examDate || exam.examDateDisplay}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 shadow-xs">
            <CalendarBlank weight="bold" className="text-blue-700 text-base" />
            <label className="text-[11px] text-slate-600 font-bold">Exam Date:</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 border border-blue-200 px-3.5 py-2 text-center">
              <span className="block text-[10px] font-black uppercase tracking-wider text-blue-800">Days Left</span>
              <span className="text-lg font-black text-blue-950">{daysRemaining} Days</span>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all"
            >
              <DownloadSimple weight="bold" /> Download PDF Study Plan
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Action Schedule (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Bar Card */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase text-slate-700">Today&apos;s Task Progress</span>
              <span className="text-xs font-black text-emerald-700">
                {completedCount} of {tasks.length} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Today's Schedule Card */}
          <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-black text-slate-900">
                <CalendarCheck weight="fill" className="text-blue-600 text-xl" />
                {exam.studyPlan.day}
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200">
                {exam.duration} Strategy
              </span>
            </div>

            {/* Task List */}
            <div className="space-y-3 mb-6">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                    task.done
                      ? 'border-slate-200 bg-slate-50/70 opacity-60'
                      : 'border-slate-300 bg-white hover:border-blue-400 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleTask(idx)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    {task.done ? (
                      <CheckCircle weight="fill" className="text-2xl text-emerald-600 shrink-0" />
                    ) : (
                      <Circle weight="bold" className="text-2xl text-slate-400 shrink-0 hover:text-blue-600 transition-colors" />
                    )}
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          task.done ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock weight="bold" /> {task.time}
                        </span>
                        <span>•</span>
                        <span className="text-blue-700 font-bold">{task.subject}</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTask(idx)}
                      className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                        task.done
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {task.done ? 'Done' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => removeTask(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Task Form */}
            <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
              <input
                type="text"
                placeholder="Add custom study task (e.g. Revision of Samacheer 9th History)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Time (e.g. 17:00 - 18:00)"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-full sm:w-40 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 placeholder-slate-500 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus weight="bold" /> Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Overall Study Plan & PYQ Downloads Sidebar (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Overall Study Plan Card */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Target weight="bold" className="text-blue-700" />
                Overall Study Plan ({daysRemaining} Days)
              </div>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1 text-[11px] font-black text-blue-700 hover:underline cursor-pointer"
              >
                <DownloadSimple weight="bold" /> PDF
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {roadmapPhases.map((phase, pIdx) => (
                <div key={pIdx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  <div className="flex items-center justify-between font-black mb-1">
                    <span className="text-blue-900">{phase.phase}: {phase.title}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">
                      {phase.dayRange}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mb-2 font-medium">{phase.focus}</p>
                  <div className="space-y-1 pl-2 border-l-2 border-blue-400">
                    {phase.tasks.map((t, tIdx) => (
                      <div key={tIdx} className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <span>•</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick PYQ Downloads Sidebar Panel */}
          <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 mb-3 border-b border-slate-200 pb-3">
              <FilePdf weight="fill" className="text-red-600 text-lg" />
              Download Previous Year Papers
            </div>

            <div className="space-y-2.5">
              {exam.pyqs.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-black text-blue-900">
                        {p.year}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">• {p.questions} Qs</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">{p.title}</div>
                  </div>

                  <a
                    href={p.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <DownloadSimple weight="bold" /> PDF Key
                  </a>
                </div>
              ))}
            </div>

            <a
              href={exam.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 hover:underline text-center w-full"
            >
              Open Official {exam.board.split(' ')[0]} Question Bank <ArrowSquareOut weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
