import { motion, AnimatePresence } from 'framer-motion';
import { PHASES } from '../constants/ladders';

const phaseColors = {
  [PHASES.IDLE]: 'text-white',
  [PHASES.PREP]: 'text-prep',
  [PHASES.START_CUE]: 'text-start',
  [PHASES.SHOOTING]: 'text-start',
  [PHASES.STOP_CUE]: 'text-stop',
  [PHASES.REST]: 'text-stop',
  [PHASES.FINISHED]: 'text-white',
};

const phaseGlows = {
  [PHASES.IDLE]: 'shadow-[0_0_30px_rgba(255,255,255,0.1)]',
  [PHASES.PREP]: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
  [PHASES.START_CUE]: 'shadow-[0_0_50px_rgba(34,197,94,0.3)]',
  [PHASES.SHOOTING]: 'shadow-[0_0_60px_rgba(34,197,94,0.4)]',
  [PHASES.STOP_CUE]: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
  [PHASES.REST]: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
  [PHASES.FINISHED]: 'shadow-[0_0_30px_rgba(255,255,255,0.2)]',
};

const TimerDisplay = ({ timeLeft, phase, isPaused }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Background Pulse Circle */}
      <AnimatePresence mode="wait">
        {phase === PHASES.SHOOTING && !isPaused && (
          <motion.div
            key="pulse"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-64 h-64 rounded-full bg-start"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`w-72 h-72 lg:w-96 lg:h-96 rounded-full glass border-2 flex flex-col items-center justify-center transition-all duration-700 ${phaseGlows[phase]}`}
        style={{ borderColor: `var(--color-${phase.toLowerCase()})` }}
      >
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs uppercase tracking-[0.3em] mb-2 font-bold ${phaseColors[phase]}`}
        >
          {phase === PHASES.PREP ? 'Attention' : phase === PHASES.SHOOTING ? 'Shooting' : phase}
        </motion.div>

        <motion.div 
          key={timeLeft}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-8xl lg:text-9xl font-outfit font-bold tracking-tighter ${phaseColors[phase]}`}
        >
          {timeLeft > 0 ? timeLeft : '0'}
        </motion.div>

        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm font-semibold text-white/50 animate-pulse"
          >
            PAUSED
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TimerDisplay;
