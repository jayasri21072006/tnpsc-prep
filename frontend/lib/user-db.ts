export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  targetExam: string;
  targetYear: string;
  medium: 'Tamil' | 'English' | 'Bilingual';
  dailyHours: string;
  createdAt: string;
  lastActiveDate: string;
  studyStreak: number;
  completedTasks: string[]; // task IDs or titles
  attemptedTests: { id: string; title: string; score: number; total: number; date: string }[];
  studyNotesViewed: string[];
  pyqsDownloaded: string[];
}

const DB_KEY = 'tn_exammate_users_db';
const SESSION_KEY = 'tn_exammate_active_session';

export function getAllUsers(): Record<string, UserRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllUsers(users: Record<string, UserRecord>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

export function getActiveUser(): UserRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const sessionEmail = JSON.parse(raw).email;
    const users = getAllUsers();
    return users[sessionEmail] || null;
  } catch {
    return null;
  }
}

export function saveActiveSession(user: UserRecord) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, id: user.id }));
    const users = getAllUsers();
    users[user.email] = user;
    saveAllUsers(users);
  } catch {
    // ignore
  }
}

export function clearActiveSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('tn_exammate_user');
  } catch {
    // ignore
  }
}

export function registerOrLoginUser(profileData: {
  id: string;
  name: string;
  email: string;
  password?: string;
  targetExam: string;
  targetYear: string;
  medium: 'Tamil' | 'English' | 'Bilingual';
  dailyHours: string;
}): UserRecord {
  const users = getAllUsers();
  const existing = users[profileData.email];
  const todayStr = new Date().toISOString().split('T')[0];

  if (existing) {
    // Returning user
    let streak = existing.studyStreak || 1;
    if (existing.lastActiveDate !== todayStr) {
      const last = new Date(existing.lastActiveDate || todayStr);
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) streak += 1;
      else if (diffDays > 1) streak = 1;
    }

    const updated: UserRecord = {
      ...existing,
      name: profileData.name || existing.name,
      targetExam: profileData.targetExam || existing.targetExam,
      lastActiveDate: todayStr,
      studyStreak: streak,
    };
    users[profileData.email] = updated;
    saveAllUsers(users);
    saveActiveSession(updated);
    return updated;
  }

  // Brand new user: calculate from 0
  const newUser: UserRecord = {
    id: profileData.id,
    name: profileData.name,
    email: profileData.email,
    password: profileData.password,
    targetExam: profileData.targetExam,
    targetYear: profileData.targetYear,
    medium: profileData.medium,
    dailyHours: profileData.dailyHours,
    createdAt: new Date().toISOString(),
    lastActiveDate: todayStr,
    studyStreak: 1, // Day 1
    completedTasks: [],
    attemptedTests: [],
    studyNotesViewed: [],
    pyqsDownloaded: [],
  };

  users[profileData.email] = newUser;
  saveAllUsers(users);
  saveActiveSession(newUser);
  return newUser;
}

export function recordTaskCompletion(email: string, taskTitle: string, isDone: boolean) {
  const users = getAllUsers();
  const user = users[email];
  if (!user) return;

  const current = new Set(user.completedTasks || []);
  if (isDone) {
    current.add(taskTitle);
  } else {
    current.delete(taskTitle);
  }
  user.completedTasks = Array.from(current);
  users[email] = user;
  saveAllUsers(users);
  saveActiveSession(user);
}

export function recordMockAttempt(email: string, testId: string, testTitle: string, score: number, total: number) {
  const users = getAllUsers();
  const user = users[email];
  if (!user) return;

  const attempts = user.attemptedTests || [];
  attempts.push({
    id: testId,
    title: testTitle,
    score,
    total,
    date: new Date().toISOString(),
  });
  user.attemptedTests = attempts;
  users[email] = user;
  saveAllUsers(users);
  saveActiveSession(user);
}

export function recordPyqDownload(email: string, pyqTitle: string) {
  const users = getAllUsers();
  const user = users[email];
  if (!user) return;

  const current = new Set(user.pyqsDownloaded || []);
  current.add(pyqTitle);
  user.pyqsDownloaded = Array.from(current);
  users[email] = user;
  saveAllUsers(users);
  saveActiveSession(user);
}

/**
 * Calculates genuine readiness score based on user's actual activity.
 * Returns dynamic metrics: readinessPercent, syllabusCoveredPercent, accuracyPercent, streak.
 */
export function calculateUserAnalytics(user: UserRecord | null) {
  if (!user) {
    return {
      readiness: 0,
      syllabusCovered: 0,
      accuracy: 0,
      streak: 1,
      tasksCompletedCount: 0,
      testsCompletedCount: 0,
      isNewUser: true,
    };
  }

  const tasksCount = (user.completedTasks || []).length;
  const tests = user.attemptedTests || [];
  const testsCount = tests.length;
  const pyqsCount = (user.pyqsDownloaded || []).length;

  // If brand new user with no completed items
  const isNewUser = tasksCount === 0 && testsCount === 0 && pyqsCount === 0;

  // Real calculation:
  // Baseline setup = 10%
  // Each task = +6% (up to 40%)
  // Each mock test = +15% (up to 40%)
  // PYQ study = +5% (up to 10%)
  let calculatedReadiness = 0;
  if (!isNewUser) {
    calculatedReadiness = Math.min(
      100,
      10 + Math.min(40, tasksCount * 6) + Math.min(40, testsCount * 15) + Math.min(10, pyqsCount * 5)
    );
  }

  // Real accuracy calculation from actual test attempts
  let calculatedAccuracy = 0;
  if (testsCount > 0) {
    const totalCorrect = tests.reduce((acc, t) => acc + t.score, 0);
    const totalPossible = tests.reduce((acc, t) => acc + t.total, 0);
    calculatedAccuracy = totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0;
  }

  // Real syllabus covered percentage
  const calculatedSyllabus = Math.min(100, Math.round(tasksCount * 12));

  return {
    readiness: calculatedReadiness,
    syllabusCovered: calculatedSyllabus,
    accuracy: calculatedAccuracy,
    streak: user.studyStreak || 1,
    tasksCompletedCount: tasksCount,
    testsCompletedCount: testsCount,
    isNewUser,
  };
}
