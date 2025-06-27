import React from "react";
import { Button, SafeAreaView, Text, View } from "react-native";

import { useVideoPlayer, VideoView } from "expo-video";

import { VideoPlayerProps } from "./props";
import { styles } from "./styles";

export default function VideoPlayer({video, onShare, onSave, onDiscard}: VideoPlayerProps){
    return(
        <SafeAreaView style={styles.container}>
            <VideoView
                style={styles.video} 
                source={{ uri: video.uri}}
                useNativeControls={true}
                isLooping
            />
            <View style={styles.menuButtons} >
                <Button title="Share" onPress={onShare} />
                <Button title="Save" onPress={onSave} />
                <Button title="Discard" onPress={onDiscard} />
            </View>
        </SafeAreaView>
    )
}