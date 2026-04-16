export const PHASES = {
  IDLE: 'IDLE',
  PREP: 'PREP', // Attention
  START_CUE: 'START_CUE',
  SHOOTING: 'SHOOTING', // Quiet
  STOP_CUE: 'STOP_CUE',
  REST: 'REST',
  FINISHED: 'FINISHED',
};

export const PROTOCOLS = [
  {
    id: '60min',
    name: 'One-Hour Protocol (60 Minutes)',
    blocks: [
      { id: 1, repeats: 5, shootingDuration: 30, restDuration: 5, goal: 'Warm-up' },
      { id: 2, repeats: 10, shootingDuration: 40, restDuration: 10, goal: 'Intensity Build' },
      { id: 3, repeats: 10, shootingDuration: 50, restDuration: 10, goal: 'High Intensity' },
      { id: 4, repeats: 10, shootingDuration: 60, restDuration: 15, goal: 'Peak Endurance' },
      { id: 5, repeats: 10, shootingDuration: 50, restDuration: 10, goal: 'High Intensity' },
      { id: 6, repeats: 10, shootingDuration: 40, restDuration: 10, goal: 'Cool-down Build' },
      { id: 7, repeats: 5, shootingDuration: 30, restDuration: 5, goal: 'Final Focus' },
    ],
  },
  {
    id: '45min',
    name: '45-Minute Protocol',
    blocks: [
      { id: 1, repeats: 10, shootingDuration: 40, restDuration: 5, goal: 'High Intensity Warm-up' },
      { id: 2, repeats: 10, shootingDuration: 50, restDuration: 10, goal: 'Sustained Focus' },
      { id: 3, repeats: 10, shootingDuration: 60, restDuration: 10, goal: 'Peak Endurance' },
      { id: 4, repeats: 10, shootingDuration: 50, restDuration: 10, goal: 'Sustained Focus' },
      { id: 5, repeats: 10, shootingDuration: 40, restDuration: 5, goal: 'High Intensity Finish' },
    ],
  },
  {
    id: '50min-rg',
    name: 'Red/Green Cycle (50 Minutes)',
    isSimpleCycle: true, // Flag for 0 prep/cue logic
    blocks: [
      { id: 1, repeats: 300, shootingDuration: 7, restDuration: 3, goal: 'High Frequency' },
    ],
  },
  {
    id: 'test',
    name: 'Quick Test (2 Rounds)',
    blocks: [
      { id: 1, repeats: 2, shootingDuration: 10, restDuration: 10, goal: 'System Check' },
    ],
  }
];

export const PREP_DURATION = 3; // 3 seconds attention/prep
export const CUE_DURATION = 1; // 1 second for start/stop cues
