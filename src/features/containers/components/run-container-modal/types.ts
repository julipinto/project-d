export interface DockerProgress {
  status: string;
  id?: string;
  progress?: string;
  progressDetail?: {
    current?: number;
    total?: number;
  };
}

export interface LayerState {
  status: string;
  current: number;
  total: number;
  percentage: number;
}
