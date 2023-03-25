import { TouchableOpacity, View } from "react-native"
import React, { PropsWithChildren } from "react"

interface TopBarButtonProps extends PropsWithChildren {
  onClick: () => void;
}

export const TopBarNavigationButton = (props: TopBarButtonProps) => {
  return (
    <View
      style={{
        marginRight: 10,
        marginLeft: 10
      }}
    >
      <TouchableOpacity onPress={props.onClick}>
        {props.children}
      </TouchableOpacity>
    </View>
  )
}
