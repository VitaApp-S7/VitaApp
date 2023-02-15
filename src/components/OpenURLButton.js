import React, {useCallback} from 'react';
import {Alert, Button, Linking, StyleSheet, View} from 'react-native';


const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button style={styles.description} title={children} onPress={handlePress} />;
};



export default OpenURLButton;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 200,
  },
  wrapper: {
    margin: 16
  },
  title: {
    fontFamily: "Poppins_600SemiBold",
    margin: 0,
    padding: 0,
    fontSize: 20,
    color: "#031D29",
  },
  description: {
    fontFamily: "Poppins_500Medium",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#052D40",
    paddingVertical: 4,
    alignSelf: 'right',
  },
  date: {
    fontFamily: "Poppins_700Bold",
    margin: 0,
    padding: 0,
    fontSize: 12,
    color: "#031D29",
  },
  screen: {
    backgroundColor: "white",
    height: "100%"
  },
  contentimage: {
    width: "100%",
    height: 150,
    paddingVertical: 4,
  },
  wrapperTop: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 4,
  },
});

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