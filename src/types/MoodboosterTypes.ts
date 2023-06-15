import { CategoryType } from "./CategoryType"

export interface UserMoodboosterType {
  completionDate?: Date;
  id: string;
  moodbooster: MoodboosterType;
  status: MoodboosterAcceptedStatus;
  userIds?: string[];
}

export interface MoodboosterType {
  id: string;
  title: string;
  description: string;
  points: number;
  category?: CategoryType;
  status: MoodboosterStatus;
}

enum MoodboosterStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum MoodboosterAcceptedStatus {
  ACCEPTED = "ACCEPTED",
  COMPLETE = "COMPLETE",
  CANCELLED = "CANCELLED",
}

export interface MoodboosterInviteType {
  inviteId: string;
  userMoodboosterId: string;
  inviterName: string;
  inviterId: string;
  invitedUserId: string;
  moodboosterName: string;
  moodboosterDescription: string;
}
