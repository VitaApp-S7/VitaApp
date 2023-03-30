import React, { useMemo, useRef } from "react"
import { WebView } from "react-native-webview"
import { Linking, Platform } from "react-native"
import { useQuery } from "@tanstack/react-query"

interface TrixHtmlViewProps {
  html: string,
  queryKey: string
}

const scalesPageToFit = Platform.OS === "android"

const htmlTemplate = `
<html lang="en">
<head >
<meta content='width=device-width, initial-scale=0.45, maximum-scale=0.45, user-scalable=0' name='viewport' />
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,400;1,600&display=swap');
html{
  font-size: 1em;
  line-height: 1.75em;
  font-family: 'Poppins', sans-serif;
}
body {
  font-size: 1.5rem;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
h1 {
  font-size: 2.75rem;
  line-height: 3.5rem;
  margin: 0;
  font-weight: 400;
}
strong {
  font-weight: 700;
}
</style>
</head>
<body>
$CONTENT
</body>
</html>
`

const TrixHtmlView = (props: TrixHtmlViewProps) => {
  const html = useQuery([ props.queryKey, props.html ],() => htmlTemplate.replace("$CONTENT", props.html),[ props.html ])

  if(!html.isSuccess) return <></>

  return (
    <WebView
      originWhitelist={[ "*" ]}
      source={{ html: html.data }}
      style={{
        height: 1000,
        flex: 0
      }}
      containerStyle={{
        flexGrow: 1,
        width: "100%"
      }}
      androidLayerType={"none"}
      automaticallyAdjustContentInsets={false}
      nestedScrollEnabled={false}
      scrollEnabled={false}
      pullToRefreshEnabled={false}
      textInteractionEnabled={false}
      scalesPageToFit={scalesPageToFit}
      bounces={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      overScrollMode={"never"}
      onShouldStartLoadWithRequest={(event) => {
        Linking.openURL(event.url)
        return false
      }}
    />
  )
}

export default TrixHtmlView