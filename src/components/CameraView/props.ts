// src/components/CameraView/props.ts
import { CameraView } from "expo-camera";

export interface CameraViewProps {
    cameraRef: React.RefObject<CameraView>;
    isRecording: boolean;
    onRecord: () => void;
    onStopRecording: () => void;
}