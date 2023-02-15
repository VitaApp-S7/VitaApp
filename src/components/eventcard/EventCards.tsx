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

// const EventCards = () => {
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

//   // function handleTodoClick(index) {
//   //   let itemsCopy = [...todos];
//   //   props.onComplete(itemsCopy[index].points);
//   //   itemsCopy.splice(index, 1);
//   //   setTodos(itemsCopy);
//   // }

//   return (
//     <View>
//       <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 20, margin: 10 }}>Recent Events</Text>
//       <View>
//         {todos.map((item, index) => (
//           <Surface style={styles.surface} elevation={1} key={index} >
//             <Card.Title
//               title={item.text} titleStyle={{ fontFamily: 'Poppins_400Regular' }}
//               // left={(props) => <Avatar.Icon {...props} icon="folder" />}
//               right={(props) => (
//                 <View style={styles.buttons}>
//                   <IconButton
//                     {...props}
//                     icon="account-plus"
//                     onPress={() => {}}
//                   />
//                   <Button
//                     mode="contained"
//                     buttonColor="#419FD9"
//                     labelStyle={{ fontFamily: 'Poppins_600SemiBold' }}
//                     onPress={() => {}}
//                   >
//                     See More
//                   </Button>
//                 </View>
//               )}
//             />
//           </Surface>
//         ))}
//       </View>
//     </View>
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

// export default EventCards;
