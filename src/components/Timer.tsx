import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  size?: number;
  strokeWidth?: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, totalTime, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference - progress * circumference;

  let color = '#4CAF50';
  if (progress < 0.6) color = '#FFC107';
  if (progress < 0.3) color = '#F44336';

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '20px' }}>
      <svg
        height={size}
        width={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear, stroke 0.5s' }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        {timeLeft.toFixed(1)}
      </div>
    </div>
  );
};

export default Timer;
