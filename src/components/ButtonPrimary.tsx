import React from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { globalStyle } from "../globalStyle"

const ButtonPrimary = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...(props.disabled ? styles.disabledBtn : styles.PrimaryBtn),
        ...props.style
      }}
      disabled={props.disabled}
    >
      <Text
        style={[
          styles.buttontext,
          props.disable ? { color: "##FEA419" } : { color: "#072C40" }
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}

export default ButtonPrimary

const styles = StyleSheet.create({
  PrimaryBtn: {
    ...globalStyle.color.gacLightBlue,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: "#BCD8F2",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    margin: 4
  },
  disabledBtn: {
    backgroundColor: "#419FD9",
    opacity: 0.3,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    margin: 4
  },
  buttontext: {
    fontFamily: "Poppins500Medium",
    fontSize: 12,
    margin: 8,
    color: "white"
  }
})
