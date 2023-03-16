import { MoodboosterStartedType, MoodboosterType } from "./MoodboosterTypes"

export type RouteParamList = {
  Home: undefined
  Account: undefined
  History: undefined
  "Moodbooster Details": {
    item: MoodboosterType | MoodboosterStartedType
  }
  Feed: undefined
}
