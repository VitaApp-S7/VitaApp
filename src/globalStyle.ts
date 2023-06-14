import { StyleSheet } from "react-native"

export const globalStyle = {
  color: StyleSheet.create({
    gacDarkblue: { backgroundColor: "#072C40" },
    gacLightBlue: { backgroundColor: "#BCD8F2" },
    gacOrange: { backgroundColor: "#FEA419" },
    gacYellow: { backgroundColor: "#FFDF6A" },
    gacBlack: { backgroundColor: "#000000" }
  }),
  boxShadow: StyleSheet.create({
    defaultShadow: {
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 0
      },
      shadowOpacity: 0.25,
      shadowRadius: 4
    }
  }),
  text: StyleSheet.create({
    title: {
      fontFamily: "Poppins600SemiBold",
      fontSize: 19,
      color: "#000000"
    },
    cardTitle: {
      fontFamily: "Poppins500Medium",
      fontSize: 17,
      color: "#000000"
    },
    description: {
      fontFamily: "Poppins400Regular",
      fontSize: 14,
      color: "#000000"
    },
    subText: {
      fontFamily: "Poppins600SemiBold",
      fontSize: 12,
      color: "#072C40",
      opacity: 0.82,
      textTransform: "uppercase"
    }
  })
}
