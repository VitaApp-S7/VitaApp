import { MoodboosterStartedType, MoodboosterType } from "./MoodboosterTypes"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RouteParamList = {
  Home: undefined;
  Account: undefined;
  History: undefined;
  "Moodbooster Details": {
    item: MoodboosterType | MoodboosterStartedType;
  };
  Feed: undefined;
};

export type NavigationRouteParamList =
  NativeStackScreenProps<RouteParamList>["navigation"];
