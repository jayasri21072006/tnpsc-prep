import React, { useEffect, useState } from 'react';
import {
  Timer,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  FilePdf,
  Play,
  ArrowSquareOut,
  Sparkle,
  DownloadSimple,
  BookOpen,
} from '@phosphor-icons/react/dist/ssr';
import { getExamDetails } from '@/lib/exam-data';
import { UserProfile } from './auth-onboarding';
import { recordMockAttempt, recordPyqDownload } from '@/lib/user-db';

export function MockTests({ profile }: { profile?: UserProfile | null }) {
  const exam = getExamDetails(profile?.targetExam);
  const [activeTestModal, setActiveTestModal] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bookMedium, setBookMedium] = useState<'tamil' | 'english'>('tamil');

  // Sample interactive questions for live simulator
  const sampleQuestions = [
    {
      q: `Which Article of the Constitution of India provides for the Right to Constitutional Remedies?`,
      options: ['Article 19', 'Article 21', 'Article 32', 'Article 226'],
      correct: 2,
      explanation: 'Article 32 was described by Dr. B.R. Ambedkar as the Heart and Soul of the Indian Constitution.',
    },
    {
      q: `Which ancient Tamil literature mentions the trade between Tamilakam and the Roman Empire?`,
      options: ['Silapathikaram', 'Pattinappalai', 'Manimekalai', 'Tolkappiyam'],
      correct: 1,
      explanation: 'Pattinappalai by Uruttirangannanar vividly describes port city Kaveripoompattinam and Roman maritime trade.',
    },
    {
      q: `If 25% of a number is 75, then what is 40% of the same number?`,
      options: ['120', '100', '150', '80'],
      correct: 0,
      explanation: 'The number is (75 * 100)/25 = 300. 40% of 300 is 120.',
    },
  ];

  const handleStartTest = (test: any) => {
    setActiveTestModal(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestSubmitted(false);
    setTestStarted(false);
    setTimeLeft(test.durationMinutes * 60);
  };

  useEffect(() => {
    if (!activeTestModal || !testStarted || testSubmitted) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(timer);
          setTestSubmitted(true);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeTestModal, testStarted, testSubmitted]);

  const calculateScore = () => {
    let score = 0;
    sampleQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  const handleSubmitTest = () => {
    setTestSubmitted(true);
    setTestStarted(false);
    if (profile?.email && activeTestModal) {
      const score = calculateScore();
      recordMockAttempt(profile.email, activeTestModal.id, activeTestModal.title, score, sampleQuestions.length);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const samacheerBooks = Array.from({ length: 7 }, (_, index) => {
    const classNumber = index + 6;
    const languageLabel = bookMedium === 'tamil' ? 'தமிழ்' : 'English';
    return {
      classNumber,
      title: bookMedium === 'tamil' ? `கிளை ${classNumber} தமிழ் புத்தகங்கள்` : `Class ${classNumber} English Books`,
      url: `https://www.tntextbooks.in/p/tamil-nadu-school-books-free-download.html?medium=${bookMedium === 'tamil' ? 'ta' : 'en'}&class=${classNumber}`,
      languageLabel,
    };
  });

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <Sparkle weight="fill" /> Full-Length Simulation & Previous Papers
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">Mock Tests & PYQs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test series and official papers specifically designed for <strong className="text-slate-800">{exam.name}</strong>.
          </p>
        </div>

        <a
          href={exam.officialSite}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          {exam.board} Official Portal <ArrowSquareOut />
        </a>
      </div>

      {/* Samacheer Kalvi Study Books */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <BookOpen weight="fill" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Samacheer Kalvi Books</h3>
              <p className="text-xs text-slate-500">Choose your preparation medium. Every Class 6–12 link uses that medium only.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            Preparation medium
            <select
              aria-label="Select preparation medium"
              value={bookMedium}
              onChange={(event) => setBookMedium(event.target.value as 'tamil' | 'english')}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
            >
              <option value="tamil">தமிழ் / Tamil</option>
              <option value="english">English</option>
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {samacheerBooks.map((book) => (
            <a
              key={book.classNumber}
              href={book.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${book.title}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <span>{book.title}</span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-800">{book.languageLabel}</span>
              <ArrowSquareOut weight="bold" className="text-blue-600" />
            </a>
          ))}
        </div>
      </div>

      {/* Available Mock Tests */}
      <div className="grid md:grid-cols-2 gap-4">
        {exam.mockTests.map((test) => (
          <div
            key={test.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  {test.type}
                </span>
                {test.score && test.score !== 'Pending' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <Trophy weight="fill" /> Score: {test.score}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{test.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-medium">
                <span className="flex items-center gap-1">
                  <Clock /> {test.durationMinutes} mins
                </span>
                <span>•</span>
                <span>{test.questions} Questions</span>
              </div>
            </div>

            <button
              onClick={() => handleStartTest(test)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              <Play weight="fill" />
              {test.score && test.score !== 'Pending' ? 'Retake Live Mock Test' : 'Start Live Mock Test'}
            </button>
          </div>
        ))}
      </div>

      {/* Official PYQs Section with Multi-Mirror Downloads */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FilePdf weight="fill" className="text-2xl" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Previous Year Question Papers (PYQ)</h3>
              <p className="text-xs text-slate-500">Authentic exam question papers directly from {exam.board} and verified mirrors.</p>
            </div>
          </div>
        </div>

        {/* Repositories Quick Links */}
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/70 p-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-blue-950">
            🏛️ Direct External Paper Archives:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="https://www.tnpsc.gov.in/English/previous_question_papers.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-blue-300 px-2.5 py-1 font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
            >
              TNPSC Archive <ArrowSquareOut weight="bold" />
            </a>
            <a
              href="https://www.winmeen.com/tnpsc-group-4-previous-year-question-paper/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-emerald-300 px-2.5 py-1 font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              Winmeen Bank <ArrowSquareOut weight="bold" />
            </a>
            <a
              href="https://www.padasalai.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-white border border-purple-300 px-2.5 py-1 font-bold text-purple-800 hover:bg-purple-600 hover:text-white transition-all shadow-xs"
            >
              Padasalai Portal <ArrowSquareOut weight="bold" />
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {exam.pyqs.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    Year: {p.year}
                  </span>
                  <span className="text-xs text-slate-500">• {p.questions} Qs</span>
                  <span className="text-xs text-slate-400">• {p.size}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 mt-1">{p.title}</h4>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={p.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (profile?.email) recordPyqDownload(profile.email, p.title);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <DownloadSimple weight="bold" /> Official Portal
                </a>

                <a
                  href={p.winmeenUrl || "https://www.winmeen.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (profile?.email) recordPyqDownload(profile.email, `${p.title} (Winmeen)`);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <ArrowSquareOut weight="bold" className="text-emerald-600" /> Winmeen Mirror
                </a>

                <a
                  href={p.vetriiUrl || "https://www.padasalai.net/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (profile?.email) recordPyqDownload(profile.email, `${p.title} (Padasalai)`);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-white border border-slate-300 px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
                >
                  <ArrowSquareOut weight="bold" className="text-purple-600" /> Padasalai
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Mock Test Simulator Modal */}
      {activeTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-test-title"
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700">{activeTestModal.title}</span>
                <h3 id="mock-test-title" className="text-base font-bold text-slate-900">Live Timed Exam Simulator</h3>
              </div>
              <button
                onClick={() => {
                  setTestStarted(false);
                  setTestSubmitted(false);
                  setActiveTestModal(null);
                }}
                aria-label="Close mock test"
                className="text-xs font-bold text-slate-400 hover:text-slate-800"
              >
                Close ✕
              </button>
            </div>

            {!testSubmitted ? (
              !testStarted ? (
                <div className="space-y-5">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                    <p className="font-bold">Isolated closed-book test</p>
                    <p className="mt-1">Do not use books, notes, search, or other people. The timer starts when you begin, and answers are hidden until submission.</p>
                  </div>
                  <div className="grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3"><strong className="text-slate-900">Exam:</strong> {activeTestModal.title}</div>
                    <div className="rounded-xl bg-slate-50 p-3"><strong className="text-slate-900">Duration:</strong> {activeTestModal.durationMinutes} minutes</div>
                    <div className="rounded-xl bg-slate-50 p-3"><strong className="text-slate-900">Questions:</strong> {sampleQuestions.length}</div>
                    <div className="rounded-xl bg-slate-50 p-3"><strong className="text-slate-900">Timing:</strong> Single session only</div>
                  </div>
                  <button
                    onClick={() => setTestStarted(true)}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Begin Test
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs font-bold text-slate-600">
                    <span>Question {currentQuestionIndex + 1} of {sampleQuestions.length}</span>
                    <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                      <Timer weight="bold" /> {formatTime(timeLeft)} remaining
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-5">
                    <p className="text-xs font-bold text-slate-900 leading-relaxed">
                      {sampleQuestions[currentQuestionIndex].q}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 mb-6">
                    {sampleQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                      const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() =>
                            setUserAnswers({ ...userAnswers, [currentQuestionIndex]: oIdx })
                          }
                          className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <span>
                            <strong className="mr-2 text-slate-400">
                              {String.fromCharCode(65 + oIdx)}.
                            </strong>
                            {opt}
                          </span>
                          {isSelected && <CheckCircle weight="fill" className="text-blue-600 text-lg" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    {currentQuestionIndex < sampleQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitTest}
                        className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
                      >
                        Submit Test & View Results
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-4 border border-emerald-200">
                  <Trophy weight="fill" className="text-3xl" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Closed-Book Test Completed</h4>
                <p className="text-xs text-slate-500 mb-6">
                  You scored <strong className="text-emerald-700 font-bold">{calculateScore()} / {sampleQuestions.length}</strong> (
                  {Math.round((calculateScore() / sampleQuestions.length) * 100)}%).
                  Your answers are now visible for review.
                </p>

                {/* Question Review List */}
                <div className="text-left space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                  {sampleQuestions.map((sq, sIdx) => {
                    const isCorrect = userAnswers[sIdx] === sq.correct;
                    return (
                      <div key={sIdx} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                        <div className="flex items-center gap-2 font-bold mb-1">
                          {isCorrect ? (
                            <span className="text-emerald-700 flex items-center gap-1">
                              <CheckCircle weight="fill" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1">
                              <XCircle weight="fill" /> Incorrect
                            </span>
                          )}
                          <span className="text-slate-900">Q{sIdx + 1}: {sq.q}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 pl-4 border-l-2 border-slate-200">
                          Explanation: {sq.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveTestModal(null)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
