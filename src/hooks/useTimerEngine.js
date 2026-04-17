import { useState, useEffect, useRef, useCallback } from 'react';
import { PHASES, PREP_DURATION, CUE_DURATION } from '../constants/ladders';
import audioService from '../services/audioService';

export const useTimerEngine = (protocol) => {
  const [phase, setPhase] = useState(PHASES.IDLE);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const timerRef = useRef(null);
  const ambientRef = useRef(null);

  // Initialize total duration based on blocks
  useEffect(() => {
    if (protocol) {
      let total = 0;
      const isSimple = protocol.isSimpleCycle;
      protocol.blocks.forEach(block => {
        const roundTime = isSimple 
          ? (block.shootingDuration + block.restDuration)
          : (PREP_DURATION + CUE_DURATION + block.shootingDuration + CUE_DURATION + block.restDuration);
        total += roundTime * block.repeats;
      });
      setTotalDuration(total);
      
      // Reset state for new protocol
      setPhase(PHASES.IDLE);
      setTimeLeft(0);
      setCurrentBlockIndex(0);
      setCurrentRepeat(1);
      setTotalElapsed(0);
      setIsPaused(false);
    }
  }, [protocol]);

  const startSession = useCallback(() => {
    if (!protocol) return;
    audioService.init();
    
    if (protocol.isSimpleCycle) {
      // Simple cycle starts directly with shooting or rest
      // Let's start with REST (Red 3s)
      setPhase(PHASES.REST);
      setTimeLeft(protocol.blocks[0].restDuration);
      audioService.playSingleBeep(); // Single beep for Red
    } else {
      audioService.playAttention(); 
      setPhase(PHASES.PREP);
      setTimeLeft(PREP_DURATION);
    }
    
    setCurrentBlockIndex(0);
    setCurrentRepeat(1);
    setTotalElapsed(0);
    setIsPaused(false);
  }, [protocol]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (ambientRef.current) ambientRef.current.stop();
    setPhase(PHASES.IDLE);
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    if (phase === PHASES.IDLE || phase === PHASES.FINISHED || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
      setTotalElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, isPaused, currentBlockIndex, currentRepeat]);

  // Handle phase transition when timeLeft hits 0
  useEffect(() => {
    if (phase !== PHASES.IDLE && phase !== PHASES.FINISHED && !isPaused && timeLeft === 0) {
      handlePhaseTransition();
    }
  }, [timeLeft, phase, isPaused]);

  const handlePhaseTransition = () => {
    const currentBlock = protocol.blocks[currentBlockIndex];
    const isSimple = protocol.isSimpleCycle;

    if (isSimple) {
      if (phase === PHASES.REST) {
        setPhase(PHASES.SHOOTING);
        setTimeLeft(currentBlock.shootingDuration);
        audioService.init(); // Just in case
        audioService.playDoubleBeep();
      } else {
        // From Shooting to Rest
        if (currentRepeat < currentBlock.repeats || currentBlockIndex < protocol.blocks.length - 1) {
           if (currentRepeat < currentBlock.repeats) {
             setCurrentRepeat(prev => prev + 1);
           } else {
             setCurrentBlockIndex(prev => prev + 1);
             setCurrentRepeat(1);
           }
           setPhase(PHASES.REST);
           setTimeLeft(currentBlock.restDuration);
           audioService.init();
           audioService.playSingleBeep(); // Single beep for Red
        } else {
           setPhase(PHASES.FINISHED);
           setTimeLeft(0);
        }
      }
      return;
    }

    switch (phase) {
      case PHASES.PREP:
        audioService.playStartCue();
        setPhase(PHASES.START_CUE);
        setTimeLeft(CUE_DURATION);
        break;

      case PHASES.START_CUE:
        setPhase(PHASES.SHOOTING);
        setTimeLeft(currentBlock.shootingDuration);
        break;

      case PHASES.SHOOTING:
        audioService.playStopCue();
        setPhase(PHASES.STOP_CUE);
        setTimeLeft(CUE_DURATION);
        break;

      case PHASES.STOP_CUE:
        setPhase(PHASES.REST);
        setTimeLeft(currentBlock.restDuration);
        ambientRef.current = audioService.playRestAmbient();
        break;

      case PHASES.REST:
        if (ambientRef.current) ambientRef.current.stop();
        
        if (currentRepeat < currentBlock.repeats) {
          setCurrentRepeat(prev => prev + 1);
          audioService.playAttention();
          setPhase(PHASES.PREP);
          setTimeLeft(PREP_DURATION);
        } else if (currentBlockIndex < protocol.blocks.length - 1) {
          setCurrentBlockIndex(prev => prev + 1);
          setCurrentRepeat(1);
          audioService.playAttention();
          setPhase(PHASES.PREP);
          setTimeLeft(PREP_DURATION);
        } else {
          setPhase(PHASES.FINISHED);
          setTimeLeft(0);
        }
        break;

      default:
        break;
    }
  };

  return {
    phase,
    timeLeft,
    currentBlockIndex,
    currentRepeat,
    isPaused,
    totalElapsed,
    totalDuration,
    startSession,
    togglePause,
    stopSession
  };
};
