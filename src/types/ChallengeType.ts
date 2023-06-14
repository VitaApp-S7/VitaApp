export interface ChallengeType {
  id: string;
  title: string;
  description: string;
  moodboosterIds: string[];
  startDate: string;
  endDate: string;
}

export interface ParticipantType {
  id: string;
  userId: string;
  name: string;
  score: number;
}

export interface TeamType {
  id: string;
  name: string;
  challengeId: string;
  reward: string;
  score: number;
  participants: ParticipantType[];
}

export interface LeaderboardType {
  participants: ParticipantType[];
}