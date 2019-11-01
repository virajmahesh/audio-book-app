import React from "react";
import {Audio} from 'expo-av';
import {StyleSheet, Text, View} from "react-native";


class ChapterPlayerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.setState({
            book: this.props.navigation.getParam('book'),
            chapter: this.props.navigation.getParam('chapter')
        });

        //TODO: Log that player setup was started

        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: true
        });

        this.loadAudio();
    }

    async loadAudio() {
        try {
            const playbackInstance = new Audio.Sound();
            const source = {
                uri: 'https://audio-book-recordings.s3-us-west-2.amazonaws.com/84/1.mp3'
            };
            const status = {
                shouldPlay: true,
                volume: 1.0
            };
            await playbackInstance.loadAsync(source, status, false);
            this.setState({playbackInstance: playbackInstance})
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        console.log(this.state);
        if (this.state.chapter == null) {
            return null;
        }
        return (
            <View>
                <View style={styles.chapterPlayer}>
                    <View style={styles.bookDetails}>
                        <Text>Frankenstein</Text>
                        <Text>Mary Shelly</Text>
                        <View style={styles.albumArt}>
                        </View>
                        <Text>Chapter 1</Text>
                    </View>
                    <View style={styles.audioPlayer}>

                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    chapterPlayer: {
        height: '100%',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    bookDetails: {
        flex: 7,
        backgroundColor: 'yellow',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioPlayer: {
        flex: 3,
        backgroundColor: 'blue'
    },
    albumArt: {
        height: 200,
        width: 150,
        backgroundColor: 'red'
    }
});

export default ChapterPlayerPage;