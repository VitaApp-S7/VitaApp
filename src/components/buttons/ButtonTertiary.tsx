import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ButtonTertiary = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.TertiaryBtn}>
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonTertiary

const styles = StyleSheet.create({
  TertiaryBtn: {
    backgroundColor: "#052D40",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: "center",
    // width: "40%",
    margin: 4
  },
  buttontext: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 12,
    margin: 8,
    color: "white"
  }
})
