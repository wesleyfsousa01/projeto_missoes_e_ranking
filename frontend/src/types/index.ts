export interface Player {
  id: string;
  name: string;
  email: string;
  score: number;
}

export interface AuthResponse {
  access_token: string;
  player: Player;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface CompletedMission {
  missionId: string;
  title: string;
  description: string;
  points: number;
  completedAt: string;
}

export interface CompleteMissionResult {
  missionId: string;
  playerId: string;
  currentScore: number;
  completedAt: string;
}

export interface RankingPlayer {
  id: string;
  name: string;
  score: number;
}
