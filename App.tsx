import { useState, useEffect, useRef, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Camera } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);

  useEffect(()=> {
    (async() => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =  await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMicrophonePermission(microphonePermission.status === 'granted');
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');

    })()
  },[]);

  if(hasCameraPermission === undefined || hasMicrophonePermission === undefined){
    return <Text>Não tem permissão de camera ou audio</Text>
  }

  if(hasMediaLibraryPermission === false){
    return <Text>Não tem permissão de biblioteca de mídia</Text>
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
