import { useState, useEffect, useRef, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Camera, CameraRecordingOptions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import VideoPlayer from './src/components/VideoPlayer';
import CameraView from './src/components/CameraView';

export default function App() {
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);

  useEffect(()=> {
    (async() => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =  await MediaLibrary.requestPermissionsAsync();
      const [video, setVideo] = useState<any>();

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

  const recordVideo = () => {
    setIsRecording(true);

    const options: CameraRecordingOptions = {
      quality: "1080p",
      maxDuration: 60,
      mute: false,
    };

    if(cameraRef && cameraRef.current){
      cameraRef.current.recordAsync(options).then((recordedVideo: any) => {
        setVideo(recordedVideo);
        setIsRecording(false);
      });
    }
    
  };

  const stopRecording = () => {
    setIsRecording(false);
    if(cameraRef && cameraRef.current){
      cameraRef.current.stopRecording();
    }
  }

  if(video){
    const saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };
    
    const shareVideo = ()  => {
      shareAsync(video.uri).then(() => {
        setVideo(undefined);
      });
    };

    const discardVideo = () => {
      setVideo(undefined);
    };

    return(
      <VideoPlayer 
        video={video} 
        onShare={shareVideo} 
        onSave={saveVideo} 
        onDiscard={discardVideo} />
    )
  }

  return (
    <CameraView 
      cameraRef={cameraRef} 
      isRecording={isRecording} 
      onRecord={recordVideo} 
      onStopRecording={stopRecording}
    />
  );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
