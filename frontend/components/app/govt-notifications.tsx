import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  WarningCircle,
  ArrowSquareOut,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr';

const NOTIFICATIONS = [
  {
    board: 'TNPSC',
    title: 'TNPSC Group 4 & VAO (Combined Civil Services Exam IV - 2026) Official Notification Released!',
    date: 'Official Gazette (Oct 6, 2026)',
    type: 'urgent',
    url: 'https://www.tnpsc.gov.in',
    details: 'Notification No. 01/2026 issued for 6,574+ Posts (VAO, Junior Assistant, Typist, Steno-Typist). Online applications open Oct 6 till Nov 5, 2026. Official Curated Written Exam Date: January 10, 2027 (Forenoon: 09:30 AM – 12:30 PM). Download full syllabus and notification at tnpsc.gov.in.',
  },
  {
    board: 'TNPSC',
    title: 'TNPSC Group 2 & 2A (Combined Civil Services Exam II) Prelims Schedule',
    date: 'Active Bulletin',
    type: 'urgent',
    url: 'https://www.tnpsc.gov.in',
    details: 'Hall ticket issuance and examination date: November 1, 2026 across all district centers in Tamil Nadu.',
  },
  {
    board: 'TNHB',
    title: 'Tamil Nadu Housing Board (TNHB) & Urban Habitat Direct Recruitment 2026-2027',
    date: 'Active Window',
    type: 'urgent',
    url: 'https://www.tnhb.tn.gov.in',
    details: 'Online portal notification for Assistant Engineer, Junior Assistant & Typist vacancies. Written exam curated for January 24, 2027.',
  },
  {
    board: 'TNUSRB',
    title: 'Sub-Inspector of Police (Taluk, AR, TSP) Final Selection List & Medical Test Schedule',
    date: '1 day ago',
    type: 'urgent',
    url: 'https://www.tnusrb.tn.gov.in',
    details: 'Candidates can download individual call letters from the official portal.',
  },
  {
    board: 'TRB',
    title: 'TNTET Paper-I & Paper-II Eligibility Certificate Validity Extended for Life-Time',
    date: '2 days ago',
    type: 'info',
    url: 'https://trb.tn.gov.in',
    details: 'G.O. passed by the School Education Department regarding life-time validity of TNTET certificates.',
  },
  {
    board: 'Madras High Court',
    title: 'Recruitment for 2329 Vacancies of Examiner, Reader, Senior Bailiff, Junior Bailiff & Typist',
    date: '4 days ago',
    type: 'urgent',
    url: 'https://www.mhc.tn.gov.in',
    details: 'Online application window and syllabus notification available on MHC recruitment portal.',
  },
  {
    board: 'TANGEDCO',
    title: 'TNEB Assistant Engineer (Electrical & Mechanical) Direct Recruitment Updates',
    date: '1 week ago',
    type: 'info',
    url: 'https://www.tangedco.gov.in',
    details: 'Syllabus and scheme of examination revised as per latest state regulations.',
  },
  {
    board: 'TNFUSRC',
    title: 'Tamil Nadu Forest Department Forester & Forest Guard Certificate Verification',
    date: '1 week ago',
    type: 'info',
    url: 'https://www.forests.tn.gov.in',
    details: 'Physical endurance test guidelines updated for upcoming selection phases.',
  },
  {
    board: 'MRB',
    title: 'Medical Services Recruitment Board: 1021 Assistant Surgeon (General) Notification',
    date: '2 weeks ago',
    type: 'urgent',
    url: 'https://www.mrb.tn.gov.in',
    details: 'CBT examination date and hall ticket release schedule announced.',
  },
  {
    board: 'Aavin',
    title: 'Manager & Executive Recruitment Online Application Window',
    date: '2 weeks ago',
    type: 'info',
    url: 'https://aavin.tn.gov.in',
    details: 'Co-operative Federation state-wide selection process notifications.',
  }
];

export function GovtNotifications() {
  const [selectedBoard, setSelectedBoard] = useState('All');

  const boards = ['All', 'TNPSC', 'TNHB', 'TNUSRB', 'TRB', 'Madras High Court', 'TANGEDCO', 'TNFUSRC', 'MRB', 'Aavin'];

  const filteredNotifs = NOTIFICATIONS.filter(
    (n) => selectedBoard === 'All' || n.board === selectedBoard
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Sparkle weight="fill" /> Real-Time Govt Gazettes & Bulletins
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">Official Government Notifications</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Direct recruitment notices, hall tickets, and annual planners from all Tamil Nadu Government Recruitment Boards.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {boards.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBoard(b)}
            className={`shrink-0 rounded-xl px-3 py-1.5 font-bold transition-all ${
              selectedBoard === b
                ? 'bg-blue-600 text-white shadow-xs'
                : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-xs'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifs.map((n, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                  n.type === 'urgent'
                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}
              >
                {n.type === 'urgent' ? (
                  <WarningCircle weight="fill" className="text-xl" />
                ) : (
                  <Bell weight="fill" className="text-xl" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-100">
                    {n.board}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Calendar /> {n.date}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{n.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{n.details}</p>
              </div>
            </div>

            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white transition-all self-end sm:self-center border border-slate-200"
            >
              Open Official Board Notice <ArrowSquareOut weight="bold" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
