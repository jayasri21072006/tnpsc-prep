import React, { useState } from 'react';
import {
  BookOpen,
  MicrophoneStage,
  CheckCircle,
  Clock,
  Sparkle,
  BookmarkSimple,
  Lightbulb,
} from '@phosphor-icons/react/dist/ssr';
import { getExamDetails } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';

interface StudyRoomProps {
  profile?: UserProfile | null;
  onActivateCoach?: () => void;
}

export function StudyRoom({ profile, onActivateCoach }: StudyRoomProps) {
  const exam = getExamDetails(profile?.targetExam);
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AI Interactive Study Room
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{exam.studyNotes.topic}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Subject: <strong className="text-slate-800">{exam.studyNotes.subject}</strong> • Standard: {exam.name} Syllabus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition-all ${
              bookmarked
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs'
            }`}
          >
            <BookmarkSimple weight={bookmarked ? 'fill' : 'bold'} className="text-base" />
            {bookmarked ? 'Bookmarked' : 'Save Note'}
          </button>

          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-xs">
            <Clock className="text-slate-400" /> 25 mins read
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <BookOpen weight="fill" className="text-blue-600" />
            Official Samacheer & Reference Study Material
          </div>
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
            Verified Content
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Overview & Conceptual Framework</h3>
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
              {exam.studyNotes.summary}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Sparkle weight="fill" className="text-blue-600" /> High-Yield Exam Points
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {exam.studyNotes.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-700 hover:border-slate-300 transition-colors font-medium"
                >
                  <span className="font-bold text-blue-600 mr-1.5">•</span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* PYQ Highlight Callout */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <Lightbulb weight="fill" className="text-lg" />
              Frequently Repeated in {exam.name}
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {exam.studyNotes.pyqTip}
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/80 p-6">
          <button
            onClick={() => setCompleted(!completed)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              completed
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
            }`}
          >
            <CheckCircle weight={completed ? 'fill' : 'bold'} className="text-lg text-emerald-600" />
            {completed ? 'Marked as Mastered' : 'Mark Topic as Mastered'}
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs font-medium text-slate-500">Need spoken explanation?</span>
            <button
              onClick={onActivateCoach}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              <MicrophoneStage weight="fill" className="text-base" />
              Ask Voice AI Coach to Explain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
