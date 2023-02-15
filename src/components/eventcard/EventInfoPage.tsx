// import { Surface } from "react-native-paper";
// import React, { useState } from "react";
// import { View, Text, StyleSheet } from "react-native";
// // import { HStack, Banner, Button } from "@react-native-material/core";
// import {
//   Avatar,
//   Card,
//   IconButton,
//   Button,
//   Title,
//   Paragraph,
// } from "react-native-paper";
// import { useFonts, Poppins_600SemiBold, Poppins_400Regular} from '@expo-google-fonts/poppins';

// const EventPage = (props) => {
//   const [todos, setTodos] = useState([
//     {
//       text: "Code a website!",
//       complete: true,
//       points: 1,
//     },
//     {
//       text: "Make videos!",
//       complete: false,
//       points: 2,
//     },
//     {
//       text: "Make a todo list!",
//       complete: false,
//       points: 3,
//     },
//   ]);

//   let [fontsLoaded] = useFonts({
//     Poppins_600SemiBold,
//     Poppins_400Regular
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   function handleTodoClick(index) {
//     let itemsCopy = [...todos];
//     props.onComplete(itemsCopy[index].points);
//     itemsCopy.splice(index, 1);
//     setTodos(itemsCopy);
//   }

//   return (
// <View>
// <Text>Here here</Text>
// </View>
//   );
// };

// const styles = StyleSheet.create({
//   buttons: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",

//   },
//   surface: {
//     borderRadius: 5,
//     paddingRight: 10,
//     marginHorizontal: 10,
//     marginVertical: 6,
//     fontFamily: 'Poppins_600SemiBold'
//   },
// });

// export default EventPage;
