export interface PigeonStatistics {
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  aliveCount: number;
  deadCount: number;
  lastUpdated: Date;
}

export interface UserStatistics {
  id?: string;
  userId: string;
  pigeons: PigeonStatistics;
  createdAt: Date;
  updatedAt: Date;
}
