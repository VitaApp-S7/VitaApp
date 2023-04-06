import React, { PropsWithChildren, useEffect } from "react"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated"
import { sleep } from "../utility/Sleep"

const animationLength = 300

export const ListItemAnimation = (props: PropsWithChildren) => {
  const entering = useSharedValue(false)
  const exiting = useSharedValue(false)

  useEffect(() => {
    if (!entering.value) entering.value = true
    return () => {
      exiting.value = true
      //This is pretty cursed, it doesn't even animate the height because the thread is blocked :).
      sleep(animationLength)
    }
  }, [])

  useEffect(() => {
    if (exiting.value) {
      exiting.value = false
    }
  }, [ exiting.value ])

  const opacity = useAnimatedStyle(() => ({
    opacity: withTiming(entering.value && !exiting.value ? 1 : 0, {
      duration: animationLength,
      easing:
        entering.value && !exiting.value
          ? Easing.bezierFn(0, 0.55, 0.45, 1)
          : Easing.bezierFn(0.55, 0, 1, 0.45)
    })
  }))
  const height = useAnimatedStyle(() => ({
    height: withTiming(entering.value && !exiting.value ? 156 : 1, {
      duration: animationLength,
      easing:
        entering.value && !exiting.value
          ? Easing.bezierFn(0, 0.55, 0.45, 1)
          : Easing.bezierFn(0.55, 0, 1, 0.45)
    })
  }))
  const transform = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(entering.value && !exiting.value ? 0 : -1000, {
          duration: animationLength,
          easing:
            entering.value && !exiting.value
              ? Easing.bezierFn(0, 0.55, 0.45, 1)
              : Easing.bezierFn(0.55, 0, 1, 0.45)
        })
      }
    ]
  }))

  return (
    <Animated.View style={[ opacity, height, transform ]}>
      {props.children}
    </Animated.View>
  )
}
