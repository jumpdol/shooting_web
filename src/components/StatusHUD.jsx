import { Target, Layers, Play, FastForward, Flag } from 'lucide-react';

const HUDItem = ({ icon: Icon, label, value, colorClass }) => (
  <div className="flex flex-col items-start gap-1">
    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-white/40">
      <Icon size={12} />
      <span>{label}</span>
    </div>
    <div className={`text-lg lg:text-xl font-outfit font-bold ${colorClass}`}>
      {value}
    </div>
  </div>
);

const StatusHUD = ({ block, round, totalRounds, nextPhase, goal }) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-3 gap-4 p-6 glass rounded-2xl">
        <HUDItem 
          icon={Layers} 
          label="Block" 
          value={`#${block}`} 
          colorClass="text-prep" 
        />
        <HUDItem 
          icon={Target} 
          label="Round" 
          value={`${round}/${totalRounds}`} 
          colorClass="text-start" 
        />
        <HUDItem 
          icon={FastForward} 
          label="Next" 
          value={nextPhase || 'N/A'} 
          colorClass="text-white/80" 
        />
      </div>
      
      {goal && (
        <div className="px-6 py-3 glass rounded-xl flex items-center justify-center gap-3">
          <Flag size={14} className="text-start" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            Goal: <span className="text-white">{goal}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusHUD;
