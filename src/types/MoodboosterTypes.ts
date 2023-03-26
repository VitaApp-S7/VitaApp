import { CategoryType } from "./CategoryType"

export type MoodboosterStartedType = {
  completionDate?: Date
  id?: string
  moodbooster: MoodboosterType
  status?: MoodboosterAcceptedStatus
  userIds?: string[]
}
export type MoodboosterType = {
  id: string
  title: string
  description: string
  points: number
  category?: CategoryType
  status: MoodboosterStatus
}

enum MoodboosterStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
enum MoodboosterAcceptedStatus {
  ACCEPTED = "ACCEPTED",
  COMPLETE = "COMPLETE",
  CANCELLED = "CANCELLED"
}

export const MoodboosterTypeToStarted = (
  mb: MoodboosterType
): MoodboosterStartedType => {
  return { moodbooster: mb }
}
