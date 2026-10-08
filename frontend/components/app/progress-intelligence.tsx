import React from 'react';
import {
  ChartLineUp,
  Target,
  Brain,
  Warning,
  Checks,
  TrendUp,
  Sparkle,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr';
import { getExamDetails } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';

export function ProgressIntelligence({
  profile,
  onNavigateTab,
}: {
  profile?: UserProfile | null;
  onNavigateTab?: (tab: string) => void;
}) {
  const exam = getExamDetails(profile?.targetExam);

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkle weight="fill" /> AI Diagnostic Engine
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Progress Intelligence & Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time readiness and weak-area analysis for <strong className="text-slate-800">{exam.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab?.('Study Room')}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
        >
          Open Study Room <ArrowRight weight="bold" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Overall Readiness"
          value={`${exam.readiness}%`}
          trend="+4.2% this week"
          icon={<ChartLineUp />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <MetricCard
          title="Syllabus Mastery"
          value="68%"
          trend="8 sub-topics remaining"
          icon={<Target />}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <MetricCard
          title="Avg Mock Accuracy"
          value="79%"
          trend="Target Cutoff: 84%"
          icon={<Brain />}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* Weak & Strong Topics Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Areas to Rescue */}
        <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Warning className="text-rose-600 text-lg" weight="fill" />
              Weak Areas Needing Attention
            </h3>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              High Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            These sections carry high weightage in {exam.name} and currently show low accuracy in mock tests.
          </p>

          <div className="space-y-4">
            <TopicProgress title="Indian Polity & Constitution Articles" score={46} color="bg-rose-500" />
            <TopicProgress title="Aptitude: Time & Work / Ratio" score={52} color="bg-amber-500" />
            <TopicProgress title="Current Affairs & Govt Schemes (2024)" score={58} color="bg-amber-500" />
          </div>

          <button
            onClick={() => onNavigateTab?.('Study Room')}
            className="w-full mt-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
          >
            Launch AI Rescue Session in Study Room
          </button>
        </div>

        {/* Strong Topics */}
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Checks className="text-emerald-600 text-lg" weight="fill" />
              Mastered Strong Topics
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Above 80%
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Areas where your accuracy is consistently high. Keep up with periodic rapid revision.
          </p>

          <div className="space-y-4">
            <TopicProgress title="General Tamil / Language Component" score={91} color="bg-emerald-500" />
            <TopicProgress title="Tamil Nadu History & Culture (Unit 8)" score={84} color="bg-emerald-500" />
            <TopicProgress title="Samacheer Science Core Concepts" score={78} color="bg-emerald-400" />
          </div>

          <button
            onClick={() => onNavigateTab?.('Mock Tests & PYQs')}
            className="w-full mt-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
          >
            Test Mastery in Full Mock
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, color, bg }: any) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2.5 rounded-xl ${bg} ${color} text-xl border border-slate-100`}>{icon}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</div>
        </div>
        <div className="text-3xl font-black text-slate-900">{value}</div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-600">
        <TrendUp weight="bold" className="text-emerald-600" /> {trend}
      </div>
    </div>
  );
}

function TopicProgress({ title, score, color }: { title: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span className="text-slate-800">{title}</span>
        <span className="text-slate-500">{score}% Accuracy</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
