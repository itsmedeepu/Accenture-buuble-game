import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { generateEquations, type Equation } from './gameLogic';
import Bubble from './components/Bubble';
import Timer from './components/Timer';
import Overlay from './components/Overlay';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [equations, setEquations] = useState<Equation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');

  // Start new level
  const startLevel = useCallback((currentLevel: number) => {
    setEquations(generateEquations(currentLevel));
    setSelectedIds([]);
    setTimeLeft(15);
    setFeedbackStatus('neutral');
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setWrongAttempts(0);
    startLevel(1);
  };

  const handleTimeUp = () => {
    setWrongAttempts(prev => prev + 1);
    setFeedbackStatus('wrong');
    setTimeout(() => {
        startLevel(level);
    }, 1000);
  };

  const handleStopGame = () => {
    setGameOver(true);
  };

  // Timer logic
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          // Instead of Game Over, move to next
          clearInterval(timer); // Pause momentarily handled by effect cleanup but logic needed here
          handleTimeUp();
          return 0; // Will be reset by startLevel
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, level, equations]); // added deps to restart timer correctly

  // Handle bubble click
  const handleBubbleClick = (id: string) => {
    if (gameOver || feedbackStatus !== 'neutral') return;

    if (selectedIds.includes(id)) {
        // Unselect logic
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        return;
    }

    const newSelected = [...selectedIds, id];
    setSelectedIds(newSelected);

    // Check if 3 bubbles selected
    if (newSelected.length === 3) {
      validateSelection(newSelected);
    }
  };

  const validateSelection = (selected: string[]) => {
    // Get values
    const selectedValues = selected.map(id => equations.find(e => e.id === id)?.value || 0);
    
    // Check if increasing order
    const isCorrect = selectedValues[0] <= selectedValues[1] && selectedValues[1] <= selectedValues[2];

    if (isCorrect) {
      setFeedbackStatus('correct');
      setScore(prev => prev + (level * 10) + Math.floor(timeLeft));
      setTimeout(() => {
        setLevel(prev => prev + 1);
        startLevel(level + 1);
      }, 1000);
    } else {
      setFeedbackStatus('wrong');
      setWrongAttempts(prev => prev + 1);
      setTimeout(() => {
        // Reset status to allow retry, don't skip level
        setFeedbackStatus('neutral');
        // We do NOT clear selection here, to allow user to unselect specific bubbles as requested
      }, 500);
    }
  };

  if (!isPlaying) {
    return (
      <div className="game-container">
        <h1>Math Bubbles</h1>
        <div className="game-icon">🫧</div>
        <p className="game-instructions">
          Select the bubbles in <strong>increasing order</strong> of their equation results. 
          <br/>
          Box Mode: Keep going as long as you can!
        </p>
        <button 
          onClick={startGame}
          className="start-button"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="status-bar">
        <div className="score-board">
            <div>Level: {level}</div>
            <div>Score: {score}</div>
            <div style={{ color: '#F44336' }}>Missed: {wrongAttempts}</div>
        </div>
        <button className="stop-button" onClick={handleStopGame}>Stop</button>
        <Timer timeLeft={timeLeft} totalTime={15} />
      </div>

      <div className={`game-box ${feedbackStatus === 'wrong' ? 'shake' : ''}`}>
        <div className="bubbles-container">
            {equations.map((eq) => (
            <Bubble 
                key={eq.id}
                equation={eq}
                onClick={handleBubbleClick}
                isSelected={selectedIds.includes(eq.id)}
                order={selectedIds.indexOf(eq.id) + 1}
                status={
                    selectedIds.length === 3 && selectedIds.includes(eq.id)
                    ? feedbackStatus 
                    : 'neutral'
                }
            />
            ))}
        </div>
      </div>

      {gameOver && (
        <Overlay 
          title="Game Over"
          message={`You reached Level ${level} with ${wrongAttempts} misses.`}
          score={score}
          buttonText="Play Again"
          onButtonClick={startGame}
          type="neutral"
        />
      )}
    </div>
  );
}

export default App;
