import React, { PropsWithChildren, useEffect } from "react"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated"

const animationLength = 300

interface ListItemAnimationProps extends PropsWithChildren {
  elementHeight: number;
  isExiting: boolean;
}

export const ListItemAnimation = ({
  isExiting,
  elementHeight,
  children
}: ListItemAnimationProps) => {
  const entering = useSharedValue(false)

  useEffect(() => {
    if (!entering.value) entering.value = true
  }, [])

  const opacity = useAnimatedStyle(() => ({
    opacity: withTiming(entering.value && !isExiting ? 1 : 0, {
      duration: animationLength,
      easing:
        entering.value && !isExiting
          ? Easing.bezierFn(0, 0.55, 0.45, 1)
          : Easing.bezierFn(0.55, 0, 1, 0.45)
    })
  }))
  const height = useAnimatedStyle(() => ({
    height: withTiming(entering.value && !isExiting ? elementHeight : 1, {
      duration: animationLength,
      easing:
        entering.value && !isExiting
          ? Easing.bezierFn(0, 0.55, 0.45, 1)
          : Easing.bezierFn(0.55, 0, 1, 0.45)
    })
  }))
  const transform = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(entering.value && !isExiting ? 0 : -1000, {
          duration: animationLength,
          easing:
            entering.value && !isExiting
              ? Easing.bezierFn(0, 0.55, 0.45, 1)
              : Easing.bezierFn(0.55, 0, 1, 0.45)
        })
      }
    ]
  }))

  return (
    <Animated.View style={[ opacity, height, transform ]}>
      {children}
    </Animated.View>
  )
}
