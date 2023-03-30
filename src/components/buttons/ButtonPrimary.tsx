import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ButtonPrimary = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={props.disabled ? styles.disabledBtn : styles.PrimaryBtn}
      disabled={props.disabled}
    >
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonPrimary

const styles = StyleSheet.create({
  PrimaryBtn: {
    backgroundColor: "#419FD9",
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
    fontFamily: "Poppins600SemiBold",
    fontSize: 12,
    margin: 8,
    color: "white"
  }
})
