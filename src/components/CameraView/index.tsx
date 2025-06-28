// src/components/CameraView/index.tsx
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { CameraView } from "expo-camera";

import { CameraViewProps } from "./props";
import { styles } from "./styles";

export default function CameraViewComponent({cameraRef, isRecording, onRecord, onStopRecording}: CameraViewProps){
    return(
        <CameraView 
            style={styles.container} 
            ref={cameraRef}
            facing="back"
            mode="video"
        >
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={isRecording ? onStopRecording : onRecord}
                    style={[styles.buttonRecord, isRecording && styles.buttonRecordRecording]}
                >
                    <Text style={styles.buttonText}>{isRecording ? "Parar" : "Gravar"}</Text>
                </TouchableOpacity>
            </View>
        </CameraView>
    )
}