import React from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { globalStyle } from "../globalStyle"

const ButtonCTA = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...(props.disabled ? styles.disabledBtn : styles.PrimaryBtn),
        ...props.style
      }}
      disabled={props.disabled}
    >
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default ButtonCTA

const styles = StyleSheet.create({
  PrimaryBtn: {
    ...globalStyle.color.gacDarkblue,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: "#072C40",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    margin: 4
  },
  disabledBtn: {
    backgroundColor: "#419FD9",
    opacity: 0.5,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    margin: 4
  },
  buttontext: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 14,
    margin: 8,
    color: "white"
  }
})
