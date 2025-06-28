import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CameraView, CameraType, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

import VideoPlayer from './src/components/VideoPlayer';
import CameraViewComponent from './src/components/CameraView';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState<any>();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted');
    })();
  }, []);

  // Solicita permissões se ainda não foram concedidas
  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
    if (!microphonePermission?.granted) {
      requestMicrophonePermission();
    }
  }, [cameraPermission, microphonePermission]);

  if (!cameraPermission || !microphonePermission) {
    return <Text>Carregando permissões...</Text>;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para câmera e áudio</Text>
      </View>
    );
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Não tem permissão de biblioteca de mídia</Text>
      </View>
    );
  }

  const recordVideo = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      try {
        const recordedVideo = await cameraRef.current.recordAsync({
          maxDuration: 60,
        });
        setVideo(recordedVideo);
      } catch (error) {
        console.error('Erro ao gravar vídeo:', error);
      } finally {
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  if (video) {
    const saveVideo = async () => {
      try {
        await MediaLibrary.saveToLibraryAsync(video.uri);
        setVideo(undefined);
      } catch (error) {
        console.error('Erro ao salvar vídeo:', error);
      }
    };

    const shareVideo = async () => {
      try {
        await shareAsync(video.uri);
        setVideo(undefined);
      } catch (error) {
        console.error('Erro ao compartilhar vídeo:', error);
      }
    };

    const discardVideo = () => {
      setVideo(undefined);
    };

    return (
      <VideoPlayer
        video={video}
        onSave={saveVideo}
        onShare={shareVideo}
        onDiscard={discardVideo}
      />
    );
  }

  return (
    <CameraViewComponent
      cameraRef={cameraRef}
      isRecording={isRecording}
      onRecord={recordVideo}
      onStopRecording={stopRecording}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});