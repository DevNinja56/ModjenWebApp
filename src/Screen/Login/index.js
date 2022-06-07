import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Alert,
  StatusBar,
  ActivityIndicator,
  Platform,
  BackHandler,
  Linking,
  Dimensions,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {showAlert} from '../../utils';
import {Strings} from '../../constants';
import VersionCheck from 'react-native-version-check';
import * as Progress from 'react-native-progress';

const Login = props => {
  const webView = useRef(null);
  const canGoBack = useRef(false);
  const [indeterminate, setIndeterminate] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const animProgress = useState(new Animated.Value(0))[0];

  const INJECTEDJAVASCRIPT =
    "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    }
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress');
      }
    };
  }, []);

  useEffect(() => {
    checkUpdateNeeded();
  }, []);

  // useEffect(() => {
  //   animate();
  // }, [isLoading]);

  const checkUpdateNeeded = async () => {
    let updateNeeded = await VersionCheck.needUpdate({
      currentVersion: '1.0',
      latestVersion: '1.0',
    });
    if (updateNeeded && updateNeeded.isNeeded) {
      Alert.alert(
        'Please update',
        'You will have to update your app to the latest version to continue using',
        [
          {
            text: 'update',
            onPress: () => {
              BackHandler.exitApp;
              Linking.openURL('https://play.google.com/store/games');
            },
          },
        ],
        {cancelable: false},
      );
    }
  };
  const onAndroidBackPress = () => {
    webView.current.goBack();
    if (!canGoBack.current) {
      showAlert(
        Strings.ALERTS.EXIT_APP.TITLE,
        Strings.ALERTS.EXIT_APP.MESSAGE,
        BackHandler.exitApp,
      );
    }
    return true;
  };
  const animate = () => {
    let progress = 0;
    setProgress(progress);
    setTimeout(() => {
      setIndeterminate(false);
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 1) {
          progress = 1;
        }
        setProgress(progress);
      }, 500);
    }, 1500);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <WebView
        source={{uri: 'https://modjen.com/'}}
        ref={webView}
        onLoad={() => setLoading(false)}
        //onLoadStart={() => setLoading(true)}
        onLoadProgress={({nativeEvent}) => {
          setProgress(nativeEvent.progress)
          if (nativeEvent.progress != 1 && isLoading == false) {
            setLoading(true);
          } else if (nativeEvent.progress == 1) {
            setLoading(false);
          }
          canGoBack.current = nativeEvent.canGoBack;
        }}
        onNavigationStateChange={data => {
          //console.log({onNavigationStateChange: data});
          webView.current.canGoBack = data;
          // canGoBack.current = data.canGoBack;
        }}
        scalesPageToFit={Platform.OS === 'android' ? false : true}
        injectedJavaScript={INJECTEDJAVASCRIPT}
        scrollEnabled
        domStorageEnabled={true}
        userAgent={
          Platform.OS === 'ios' ? 'modjen iosApp' : 'modjen androidApp'
        }
      />
      {isLoading && (
        <Progress.Bar
          width={Dimensions.get('window').width}
          height={2}
          progress={progress}
          //indeterminate={indeterminate}
          style={{
            backgroundColor: 'red',
            position: 'absolute',
            top: `3%`,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Login;
