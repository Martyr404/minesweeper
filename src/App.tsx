import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BoardData, DifficultyLevel, DIFFICULTIES, GameStatus, DifficultyConfig } from './types';
import { createEmptyBoard, placeMines, revealRegion, toggleFlag, checkWinCondition, revealAllMines } from './utils/gameLogic';
import Header from './components/Header';
import DifficultySelector from './components/DifficultySelector';
import Cell from './components/Cell';
import GameOverModal from './components/GameOverModal';
import CustomDifficultyModal from './components/CustomDifficultyModal';
import ReplayControls from './components/ReplayControls';
import HelpModal from './components/HelpModal';
import { QuestionMarkIcon, GlobeIcon, GamepadIcon, ExternalLinkIcon } from './components/Icons';
import { translations, config } from './data';

function App() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [customConfig, setCustomConfig] = useState<DifficultyConfig>({ rows: 10, cols: 10, mines: 10 });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);

  const [board, setBoard] = useState<BoardData>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [timer, setTimer] = useState(0);
  const [minesLeft, setMinesLeft] = useState(0);

  // Replay & History State
  const [history, setHistory] = useState<BoardData[]>([]);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [isGodMode, setIsGodMode] = useState(false);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [initialMineLocations, setInitialMineLocations] = useState<{ row: number, col: number }[] | null>(null);

  // Cheat Mode State
  const [isCheatMode, setIsCheatMode] = useState(false);

  // Language State
  const [lang, setLang] = useState<'en' | 'zh'>('en');

  const timerRef = useRef<number | null>(null);
  const replayTimerRef = useRef<number | null>(null);

  // Get current translation object
  const t = translations[lang];

  const getCurrentConfig = useCallback((): DifficultyConfig => {
    if (difficulty === 'Custom') {
      return customConfig;
    }
    return DIFFICULTIES[difficulty];
  }, [difficulty, customConfig]);

  // Init Game can now accept optional fixed mines
  const initGame = useCallback((fixedMines: { row: number, col: number }[] | null = null) => {
    const config = getCurrentConfig();
    const newBoard = createEmptyBoard(config.rows, config.cols);
    setBoard(newBoard);
    setGameStatus('idle');
    setTimer(0);
    setMinesLeft(config.mines);
    setHistory([newBoard]); // Initial empty state
    setIsReplayMode(false);
    setIsGodMode(false);
    setIsCheatMode(false); // Reset cheat mode on new game
    setIsReplayPlaying(false);
    setInitialMineLocations(fixedMines); // Set for retry if provided, else waiting for first click
    setIsGameOverOpen(false); // Reset modal visibility

    if (timerRef.current) window.clearInterval(timerRef.current);
    if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
  }, [getCurrentConfig]);

  // Initial game load
  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
    };
  }, [initGame]);

  // Cheat Mode Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (config.allowCheats && e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        setIsCheatMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost' || board[row][col].isFlagged || isReplayMode) return;

    let newBoard = [...board];
    let currentMineLocs = initialMineLocations;

    if (gameStatus === 'idle') {
      const config = getCurrentConfig();
      // Use existing fixed mines if retrying level, otherwise generate new
      const placementResult = placeMines(newBoard, config.mines, { row, col }, currentMineLocs || undefined);
      newBoard = placementResult.board;
      currentMineLocs = placementResult.mineLocations;

      setInitialMineLocations(currentMineLocs);

      // We must save the "post-mine-placement" but "pre-reveal" state to history 
      // so replay shows the board *before* the first reveal but *with* mines logically present

      setGameStatus('playing');
      startTimer();
    }

    // Reveal Logic
    newBoard = revealRegion(newBoard, row, col);

    // Save state to history
    setHistory(prev => [...prev, newBoard]);

    // Check Loss
    if (newBoard[row][col].isMine) {
      const revealedMines = revealAllMines(newBoard);
      setBoard(revealedMines);
      setHistory(prev => [...prev, revealedMines]); // Save final state
      setGameStatus('lost');
      stopTimer();
      setIsGameOverOpen(true);
      return;
    }

    setBoard(newBoard);

    // Check Win
    if (checkWinCondition(newBoard)) {
      setGameStatus('won');
      stopTimer();
      // Flag remaining mines visually
      const wonBoard = newBoard.map(r => r.map(c => c.isMine ? { ...c, isFlagged: true } : c));
      setBoard(wonBoard);
      setHistory(prev => [...prev, wonBoard]); // Save final state
      setMinesLeft(0);
      setIsGameOverOpen(true);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus === 'won' || gameStatus === 'lost' || isReplayMode) return;
    if (board[row][col].isRevealed) return;

    const newBoard = toggleFlag(board, row, col);
    setBoard(newBoard);
    setHistory(prev => [...prev, newBoard]);

    // Update mines left count
    const config = getCurrentConfig();
    const flaggedCount = newBoard.flat().filter(c => c.isFlagged).length;
    setMinesLeft(config.mines - flaggedCount);
  };

  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    if (newDiff === 'Custom') {
      setIsCustomModalOpen(true);
      return;
    }
    setDifficulty(newDiff);
  };

  const handleCustomSubmit = (config: DifficultyConfig) => {
    setCustomConfig(config);
    setDifficulty('Custom');
    setIsCustomModalOpen(false);
  };

  // --- Replay Logic ---

  const handleStartReplay = () => {
    setIsReplayMode(true);
    setReplayIndex(0);
    setIsGodMode(false);
    setIsGameOverOpen(false); // Close modal when starting replay
  };

  const handleRetryLevel = () => {
    // Restart with the same mine locations
    initGame(initialMineLocations);
  };

  const toggleReplayPlay = () => {
    if (isReplayPlaying) {
      setIsReplayPlaying(false);
      if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
    } else {
      setIsReplayPlaying(true);
      replayTimerRef.current = window.setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= history.length - 1) {
            setIsReplayPlaying(false);
            if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 800); // 800ms per step
    }
  };

  const handleReplaySeek = (index: number) => {
    setReplayIndex(index);
    if (index === history.length - 1) {
      setIsReplayPlaying(false);
      if (replayTimerRef.current) window.clearInterval(replayTimerRef.current);
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  // Determine what board to show
  const displayBoard = isReplayMode && history.length > 0 ? history[replayIndex] : board;

  // Dynamic grid style based on rows/cols
  const getGridStyle = () => {
    if (displayBoard.length === 0) return {};
    return {
      gridTemplateColumns: `repeat(${displayBoard[0].length}, minmax(0, 1fr))`,
    };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 font-sans select-none overflow-x-hidden pb-32 relative">

      {/* Top Left Controls: Help & Other Games */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="p-2.5 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200"
          title={t.app.howToPlayTooltip}
        >
          <QuestionMarkIcon className="w-6 h-6" />
        </button>

        <a
          href="https://pigeonlx.top/#/playground"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-2 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200 no-underline"
          title={t.app.otherGames}
        >
          <GamepadIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline font-bold text-sm tracking-wide">{t.app.otherGames}</span>
          <ExternalLinkIcon className="w-3 h-3 opacity-50 hidden sm:block group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      {/* Language Switch Button - Absolute Positioned Top Right */}
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 p-2.5 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200 z-10 flex items-center justify-center"
        title={t.app.switchLanguageTooltip}
      >
        <GlobeIcon className="w-6 h-6" />
      </button>

      <div className="mb-8 text-center mt-8 sm:mt-0">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">{t.app.title}</h1>
        <p className="text-slate-500 font-medium">{t.app.subtitle}</p>
      </div>

      {!isReplayMode && (
        <DifficultySelector
          currentDifficulty={difficulty}
          onChange={handleDifficultyChange}
          texts={t.difficulty}
        />
      )}

      {isReplayMode && (
        <div className="mb-6 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold border border-indigo-200">
          {t.app.replayMode}
        </div>
      )}

      {/* Main Game Container - Decoupled Header and Board for better responsiveness */}
      <div className="w-full flex flex-col items-center gap-6">

        {/* Header - Centered and constrained max-width */}
        <div className="w-full">
          <Header
            minesLeft={isReplayMode ? '?' : minesLeft}
            timer={timer}
            gameStatus={isReplayMode ? 'playing' : gameStatus}
            onReset={() => initGame()}
            texts={t.header}
          />
        </div>

        {/* Board Card - Fits content but constrained to screen width with scrolling */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-xl border border-slate-200 overflow-auto custom-scrollbar w-fit max-w-full mx-auto">
          <div className="grid gap-1" style={getGridStyle()}>
            {displayBoard.map((row, rIndex) => (
              row.map((cell, cIndex) => (
                <Cell
                  key={`${rIndex}-${cIndex}`}
                  data={cell}
                  onClick={handleCellClick}
                  onContextMenu={handleContextMenu}
                  gameStatus={isReplayMode ? 'won' : gameStatus} // Prevent clicks in replay mode by faking status
                  isGodMode={(isReplayMode && isGodMode) || (!isReplayMode && isCheatMode)}
                />
              ))
            ))}
          </div>
        </div>

      </div>

      {!isReplayMode && (
        <GameOverModal
          isOpen={isGameOverOpen}
          onClose={() => setIsGameOverOpen(false)}
          status={gameStatus}
          onRestart={() => initGame()}
          onRetryLevel={handleRetryLevel}
          onReview={handleStartReplay}
          timeTaken={timer}
          texts={t.gameOver}
        />
      )}

      {isReplayMode && (
        <ReplayControls
          isPlaying={isReplayPlaying}
          onPlayPause={toggleReplayPlay}
          currentIndex={replayIndex}
          totalSteps={history.length}
          onSeek={handleReplaySeek}
          isGodMode={isGodMode}
          onToggleGodMode={() => setIsGodMode(!isGodMode)}
          onClose={() => initGame()}
          texts={t.replay}
        />
      )}

      <CustomDifficultyModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomSubmit}
        initialConfig={customConfig}
        texts={t.customModal}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        texts={t.helpModal}
      />

      {!isReplayMode && (
        <footer className="mt-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
          <p>{t.app.footer}</p>
          <p className="text-xs opacity-50">{translations.version}</p>
        </footer>
      )}
    </div>
  );
}

export default App;