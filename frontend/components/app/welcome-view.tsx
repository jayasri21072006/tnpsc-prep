import { Button } from '@/components/ui/button';

const Waveform = () => (
  <div className="jarvis-waveform" aria-hidden="true">
    {[18, 34, 54, 38, 64, 38, 54, 34, 18].map((height, index) => (
      <span key={index} style={{ height: `${height}px`, animationDelay: `${index * 90}ms` }} />
    ))}
  </div>
);

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="jarvis-screen">
      <div className="jarvis-grid" aria-hidden="true" />
      <div className="jarvis-noise" aria-hidden="true" />
      <header className="jarvis-header">
        <div className="jarvis-brand" aria-label="TN Gov Exams AI">
          <span className="jarvis-brand-mark">TN</span>
          <span>TN GOV EXAMS AI</span>
        </div>
        <div className="jarvis-status">
          <i /> AI MENTOR READY
        </div>
      </header>
      <main className="jarvis-content">
        <div className="jarvis-orb" aria-hidden="true">
          <div className="jarvis-ring jarvis-ring-outer" />
          <div className="jarvis-ring jarvis-ring-middle" />
          <div className="jarvis-ring jarvis-ring-inner" />
          <div className="jarvis-crosshair" />
          <span className="jarvis-orbit-dot jarvis-dot-one" />
          <span className="jarvis-orbit-dot jarvis-dot-two" />
          <div className="jarvis-core">
            <Waveform />
          </div>
        </div>
        <p className="jarvis-eyebrow">தமிழ்நாடு அரசுத் தேர்வுகள் AI வழிகாட்டி</p>
        <h1>TNPSC, TNUSRB, TRB & TNEB Co-Pilot</h1>
        <p className="jarvis-subtitle">
          Syllabus • Samacheer Kalvi • PYQs • Study Notes PDF • Mock Tests
        </p>
        <Button size="lg" onClick={onStartCall} className="jarvis-talk-button">
          <span className="jarvis-button-pulse" />
          {startButtonText === 'Start call' ? 'Start TN Exam Prep Voice' : startButtonText}
          <span aria-hidden="true">&rarr;</span>
        </Button>
        <p className="jarvis-hint">
          CLICK TO TALK IN TAMIL OR ENGLISH (தமிழ் அல்லது ஆங்கிலத்தில் பேசலாம்)
        </p>
      </main>
      <footer className="jarvis-footer">
        <span>TN GOV EXAM AI // v2.0</span>
        <span>OFFICIAL SYLLABUS & SAMACHEER KALVI INTEGRATED</span>
      </footer>
    </div>
  );
};
