import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";

const SecondaryBtn = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.SecondaryBtn}
    >
      <Text style={styles.buttontext}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryBtn;

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
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    margin: 8,
    color: "#FA9901",
  },
});
