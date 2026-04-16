import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, ChevronRight, Settings, Info } from 'lucide-react';
import { PROTOCOLS, PHASES, PREP_DURATION, CUE_DURATION } from './constants/ladders';
import { useTimerEngine } from './hooks/useTimerEngine';
import ProgressBar from './components/ProgressBar';
import TimerDisplay from './components/TimerDisplay';
import StatusHUD from './components/StatusHUD';

function App() {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const timer = useTimerEngine(selectedProtocol);

  const getNextPhase = () => {
    switch (timer.phase) {
      case PHASES.PREP: return 'START';
      case PHASES.START_CUE: return 'SHOOT';
      case PHASES.SHOOTING: return 'STOP';
      case PHASES.STOP_CUE: return 'REST';
      case PHASES.REST: return 'PREP';
      default: return 'IDLE';
    }
  };

  if (!selectedProtocol) {
    return (
      <div className="min-h-screen bg-charcoal p-6 flex flex-col items-center justify-center font-sans overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-outfit font-bold tracking-tight text-white">
              PRO <span className="text-start">SHOOTING</span> TIMER
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">ELITE TRAINING PROTOCOLS</p>
          </div>

          <div className="space-y-4">
            {PROTOCOLS.map((protocol) => {
              const totalSeconds = protocol.blocks.reduce((acc, block) => {
                const roundTime = protocol.isSimpleCycle 
                  ? (block.shootingDuration + block.restDuration)
                  : (PREP_DURATION + CUE_DURATION + block.shootingDuration + CUE_DURATION + block.restDuration);
                return acc + (roundTime * block.repeats);
              }, 0);

              return (
                <motion.button
                  key={protocol.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProtocol(protocol)}
                  className="w-full p-6 glass rounded-2xl flex items-center justify-between group transition-all hover:bg-white/10"
                >
                  <div className="text-left">
                    <div className="text-lg font-bold text-white group-hover:text-start transition-colors">
                      {protocol.name}
                    </div>
                    <div className="text-xs text-white/40 font-medium">
                      {protocol.blocks.length} blocks • {Math.floor(totalSeconds / 60)} minutes
                    </div>
                  </div>
                  <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 pt-4">
             <button className="flex items-center gap-2 text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">
               <Settings size={14} /> Settings
             </button>
             <button className="flex items-center gap-2 text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">
               <Info size={14} /> Help
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = timer.totalElapsed / timer.totalDuration;

  return (
    <div className="min-h-screen bg-charcoal p-6 md:p-10 flex flex-col font-sans">
      {/* Top Navigation / Progress */}
      <div className="w-full max-w-2xl mx-auto space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => timer.stopSession() || setSelectedProtocol(null)}
            className="text-xs font-bold tracking-widest text-white/40 hover:text-white transition-colors uppercase"
          >
            ← Exit Session
          </button>
          <div className="text-xs font-bold tracking-widest text-white/40 uppercase">
            {selectedProtocol.name}
          </div>
        </div>
        
        <ProgressBar progress={progress} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-12">
        <TimerDisplay 
          timeLeft={timer.timeLeft} 
          phase={timer.phase} 
          isPaused={timer.isPaused} 
        />

        <StatusHUD 
          block={timer.phase === PHASES.FINISHED ? selectedProtocol.blocks.length : timer.currentBlockIndex + 1}
          round={timer.phase === PHASES.FINISHED ? selectedProtocol.blocks[selectedProtocol.blocks.length - 1].repeats : timer.currentRepeat}
          totalRounds={selectedProtocol.blocks[Math.min(timer.currentBlockIndex, selectedProtocol.blocks.length - 1)].repeats}
          nextPhase={getNextPhase()}
          goal={selectedProtocol.blocks[Math.min(timer.currentBlockIndex, selectedProtocol.blocks.length - 1)].goal}
        />

        {/* Controls */}
        <div className="flex gap-6 items-center">
          {timer.phase === PHASES.IDLE || timer.phase === PHASES.FINISHED ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={timer.startSession}
              className="w-20 h-20 rounded-full bg-start text-charcoal flex items-center justify-center shadow-lg shadow-start/20"
            >
              <Play fill="currentColor" size={32} />
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={timer.togglePause}
                className="w-16 h-16 rounded-full glass flex items-center justify-center text-white"
              >
                {timer.isPaused ? <Play fill="currentColor" size={24} /> : <Pause fill="currentColor" size={24} />}
              </motion.button>

              {!selectedProtocol.isSimpleCycle && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => timer.stopSession() || setSelectedProtocol(null)}
                  className="w-16 h-16 rounded-full glass flex items-center justify-center text-stop"
                >
                  <Square fill="currentColor" size={24} />
                </motion.button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Info */}
      <div className="w-full max-w-2xl mx-auto pt-10 pb-4 text-center">
         <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
           Phase: {timer.phase} • Time: {Math.floor(timer.totalElapsed / 60)}:{ (timer.totalElapsed % 60).toString().padStart(2, '0') }
         </p>
      </div>
    </div>
  );
}

export default App;
