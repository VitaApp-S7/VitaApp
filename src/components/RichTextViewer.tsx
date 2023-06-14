import React, { useMemo, useState } from "react"
import { Linking, Platform, View } from "react-native"
import AutoHeightWebView from "react-native-autoheight-webview"

interface QuillHtmlViewProps {
  html: string;
  queryKey: string;
}

const RichTextViewer = (props: QuillHtmlViewProps) => {
  const html = useMemo(
    () => `
    <html lang="en">
<head>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;1,400;1,600&display=swap');
    .ql-richtext {
      font-size: 1.2rem;
      padding: 0;
      margin: 0;
      line-height: 1.75em;
      font-family: 'Poppins', sans-serif;
    }
    .ql-syntax {
      background-color: #f3f3f3;
      padding: 10px;
      font-family: 'Courier New', monospace;
    }
    .ql-richtext img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="ql-richtext">${props.html}</div>
</body>
</html>

        `,
    [props.html]
  )
  const [height, setHeight] = useState(0)

  return (
    <View style={{ height: height + 25 }}>
      <AutoHeightWebView
        originWhitelist={["*"]}
        source={{ html: html }}
        style={{
          width: "100%",
          marginTop: 5
        }}
        containerStyle={{
          flex: 1,
          width: "100%"
        }}
        onSizeUpdated={(size) => {
          if (size.height > height) setHeight(size.height)
        }}
        androidLayerType={"none"}
        automaticallyAdjustContentInsets={false}
        nestedScrollEnabled={false}
        scrollEnabled={false}
        pullToRefreshEnabled={false}
        textInteractionEnabled={false}
        scalesPageToFit={Platform.OS === "android"}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode={"never"}
      />
    </View>
  )
}

const richTextViewer = RichTextViewer
export default richTextViewer
