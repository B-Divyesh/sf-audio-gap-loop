export interface Cadence {
  gapSeconds: number;
  repetitions: number;
  speed: number;
  volume: number;
}

export interface Clip {
  id: string;
  title: string;
  transcript: string;
  activeLine: number;
  audio: Blob;
  mimeType: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
  cadence: Cadence;
}

export interface PracticeLog {
  id: string;
  clipId: string;
  completedAt: string;
  repetitions: number;
  secondsListened: number;
}

export interface CadencePreset {
  id: string;
  name: string;
  cadence: Cadence;
}

export interface BackupFile {
  schema: 1;
  exportedAt: string;
  clips: Array<Omit<Clip, 'audio'> & { audioBase64: string }>;
  logs: PracticeLog[];
}
