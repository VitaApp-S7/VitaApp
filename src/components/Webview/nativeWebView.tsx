import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

class NativeWebView extends Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: '<h1>Hello world</h1>' }}
      />
    );
  }
}
export default NativeWebView