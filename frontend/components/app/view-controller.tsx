'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAgent, useSessionContext } from '@livekit/components-react';
import { AgentSessionView_01 } from '@/components/agents-ui/blocks/agent-session-view-01';
import { DashboardLayout } from '@/components/app/dashboard-layout';
import { DashboardContent } from '@/components/app/dashboard-content';
import { ExploreExams } from '@/components/app/explore-exams';
import { ProgressIntelligence } from '@/components/app/progress-intelligence';
import { StudyRoom } from '@/components/app/study-room';
import { MyPreparation } from '@/components/app/my-preparation';
import { MockTests } from '@/components/app/mock-tests';
import { GovtNotifications } from '@/components/app/govt-notifications';
import { AuthOnboarding, UserProfile } from '@/components/app/auth-onboarding';
import { X, Sparkle } from '@phosphor-icons/react/dist/ssr';

const MotionSessionView = motion.create(AgentSessionView_01);

const VIEW_MOTION_PROPS = {
  variants: {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: { duration: 0.2, ease: 'easeInOut' },
};

interface ViewControllerProps {
  isVideoInputSupported: boolean;
}

export function ViewController({ isVideoInputSupported }: ViewControllerProps) {
  const { isConnected, start, end } = useSessionContext();
  const agent = useAgent();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tn_exammate_user');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const handleUpdateTarget = (newExam: string) => {
    if (!profile) return;
    const updated = { ...profile, targetExam: newExam };
    setProfile(updated);
    try {
      localStorage.setItem('tn_exammate_user', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('tn_exammate_user');
    } catch {
      // ignore
    }
    setProfile(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping"></span>
          Loading TN ExamMate...
        </div>
      </div>
    );
  }

  if (!profile) {
    return <AuthOnboarding onComplete={(p) => setProfile(p)} />;
  }

  return (
    <DashboardLayout
      onActivateCoach={start}
      isCoachActive={isConnected}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      profile={profile}
      onLogout={handleLogout}
      onChangeTarget={handleUpdateTarget}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...VIEW_MOTION_PROPS} className="h-full">
          {activeTab === 'Dashboard' && (
            <DashboardContent
              profile={profile}
              onNavigateTab={setActiveTab}
              onActivateCoach={start}
            />
          )}
          {activeTab === 'Explore Exams' && (
            <ExploreExams
              profile={profile}
              onSelectTargetExam={(examName) => {
                handleUpdateTarget(examName);
                setActiveTab('Dashboard');
              }}
              onNavigateTab={setActiveTab}
            />
          )}
          {activeTab === 'My Preparation' && <MyPreparation profile={profile} />}
          {activeTab === 'Study Room' && (
            <StudyRoom profile={profile} onActivateCoach={start} />
          )}
          {activeTab === 'Mock Tests & PYQs' && <MockTests profile={profile} />}
          {activeTab === 'Progress Intelligence' && (
            <ProgressIntelligence profile={profile} onNavigateTab={setActiveTab} />
          )}
          {activeTab === 'Govt Notifications' && <GovtNotifications />}
        </motion.div>
      </AnimatePresence>

      {/* Floating AI Coach Overlay when connected */}
      <AnimatePresence>
        {isConnected && (
          <motion.div
            key="session-overlay"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed right-6 bottom-6 z-50 flex h-[520px] w-96 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="z-10 flex shrink-0 items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-base">
                  🤖
                </div>
                <div>
                  <h3 className="text-xs font-extrabold tracking-wide text-white uppercase flex items-center gap-1.5">
                    TN AI Coach <Sparkle weight="fill" />
                  </h3>
                  <p className="text-[11px] font-semibold text-blue-100 opacity-90">
                    Active on: {profile.targetExam} ({activeTab})
                  </p>
                </div>
              </div>
              <button
                onClick={() => end?.()}
                className="rounded-lg bg-black/20 p-1.5 text-white hover:bg-black/40 transition-colors"
                title="Disconnect AI Coach"
              >
                <X weight="bold" />
              </button>
            </div>

            {/* Session Room */}
            <div className="relative flex-1 bg-slate-900">
              <MotionSessionView
                key="session-view"
                preConnectMessage={agent.isConnected ? 'AI Coach listening in Tamil & English...' : 'Connecting to LiveKit agent...'}
                supportsChatInput={true}
                supportsVideoInput={false}
                supportsScreenShare={false}
                isPreConnectBufferEnabled={true}
                themeMode="dark"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
