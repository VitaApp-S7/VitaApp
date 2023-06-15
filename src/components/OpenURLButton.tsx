import React, { useCallback } from "react"
import { Alert, Button, Linking, StyleSheet } from "react-native"

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url)

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }, [ url ])

  return (
    <Button style={styles.description} title={children} onPress={handlePress} />
  )
}

export default OpenURLButton

const styles = StyleSheet.create({
  description: {
    fontFamily: "Poppins500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    alignSelf: "right"
  }
})

// const App = () => {
//   return (
//     <View style={styles.container}>
//       <OpenURLButton url={supportedURL}>Open Supported URL</OpenURLButton>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;
