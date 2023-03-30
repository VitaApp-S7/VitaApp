import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ButtonSecondary = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={styles.SecondaryBtn}>
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonSecondary

const styles = StyleSheet.create({
  SecondaryBtn: {
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    marginRight: 4,
    borderColor: "#FA9901"
  },
  buttontext: {
    fontFamily: "Poppins600SemiBold",
    fontSize: 12,
    margin: 8,
    color: "#FA9901"
  }
})
