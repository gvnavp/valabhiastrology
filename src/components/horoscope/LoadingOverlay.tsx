import React, { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  onComplete: () => void;
}

const STEPS: Array<{ text: string; duration: number; isCountdown?: boolean }> = [
  { text: 'Decoding your Cosmic Blue Print...', duration: 1200 },
  { text: '12 Signs · 27 Stars · 9 Planets', duration: 1200 },
  { text: 'One Unique Combination', duration: 700 },
  { text: 'That is YOU', duration: 700 },
  { text: '3...', duration: 600, isCountdown: true },
  { text: '2...', duration: 600, isCountdown: true },
  { text: '1...', duration: 600, isCountdown: true },
];

export default function LoadingOverlay({ onComplete }: LoadingOverlayProps): JSX.Element {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let idx = 0;
    let cancelled = false;

    function advance() {
      if (cancelled) return;
      if (idx >= STEPS.length) {
        setVisible(false);
        setTimeout(onComplete, 200);
        return;
      }
      setStepIndex(idx);
      const duration = STEPS[idx].duration;
      idx++;
      setTimeout(advance, duration);
    }

    advance();

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  if (!visible) return <></>;

  const currentStep = STEPS[stepIndex];
  const isCountdown = currentStep?.isCountdown ?? false;

  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-stars" />
      {isCountdown ? (
        <div className="loading-countdown" key={`cd-${stepIndex}`}>
          {currentStep.text}
        </div>
      ) : (
        <div className="loading-text" key={`t-${stepIndex}`}>
          {currentStep?.text}
        </div>
      )}
      <p className="loading-sub">Calculating your celestial blueprint...</p>
    </div>
  );
}
