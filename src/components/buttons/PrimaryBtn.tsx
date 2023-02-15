import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, StyleSheet, Pressable, Touchable, TouchableHighlight, TouchableOpacity } from "react-native";

const PrimaryBtn = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={ props.disabled ? styles.disabledBtn : styles.PrimaryBtn}
      disabled={props.disabled}
    >
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryBtn;

const styles = StyleSheet.create({
  PrimaryBtn: {
    backgroundColor: "#419FD9",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    margin: 4,
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
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    margin: 8,
    color: "white",
  },
});
