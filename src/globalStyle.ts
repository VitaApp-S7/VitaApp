import { StyleSheet } from "react-native"

export const globalStyle = {
  color: StyleSheet.create({
    gacDarkblue: { backgroundColor: "#072C40" },
    gacLightBlue: { backgroundColor: "#BCD8F2" },
    gacOrange: { backgroundColor: "#FEA419" },
    gacYellow: { backgroundColor: "" },
    gacBlack: { backgroundColor: "#000000" }
  }),
  boxShadow: StyleSheet.create({
    defaultShadow: {
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.25,
      shadowRadius: 8
    }
  }),
  text: StyleSheet.create({
    title: {
      fontFamily: "Poppins600SemiBold",
      fontSize: 19,
      color: "#000000"
    },
    description: {
      fontFamily: "Poppins600SemiBold",
      fontSize: 12,
      color: "#000000"
    },
    subText: {
      fontFamily: "Poppins600SemiBold",
      fontSize: 12,
      color: "#072C40",
      opacity: 0.42,
      textTransform: "uppercase"
    }
  })
}
