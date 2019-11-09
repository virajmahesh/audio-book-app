import React from "react";
import {Audio} from 'expo-av';
import {Slider, StyleSheet, Text, View, Image} from "react-native";
import {Icon} from "react-native-elements";


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

        //this.loadAudio();
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
                        <Image style={styles.albumArt} source={{uri: this.state.book.getImageURL()}} resizeMode='contain'/>
                    </View>
                    <View style={styles.audioPlayer}>
                        <Text style={styles.chapterName}>{this.state.chapter.state.title}</Text>
                        <Text style={styles.bookTitleAndAuthor}>{this.state.book.state.title} · {this.state.book.state.author}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                            <View><Text>00:00</Text></View>
                            <View style={{alignItems: 'center'}}>
                                <Slider
                                    style={styles.audioSeekBar}
                                    minimumValue={0}
                                    maximumValue={1}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="#000000"
                                />
                            </View>
                            <View><Text>10:00</Text></View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Icon
                                type="material"
                                name="skip-previous"
                                size={30}
                                color="#000000"
                            />
                            <Icon
                                type="material"
                                name="replay-30"
                                size={35}
                                color="#000000"
                            />
                            <Icon
                                type="material"
                                name="play-arrow"
                                size={50}
                                color="#000000"
                            />
                            <Icon
                                type="material"
                                name="forward-30"
                                size={35}
                                color="#000000"
                            />
                            <Icon
                                type="material"
                                name="skip-next"
                                size={30}
                                color="#000000"
                            />
                        </View>
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
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioPlayer: {
        flex: 3.5,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center'
    },
    albumArt: {
        width: '75%',
        height: '75%',
        marginBottom: 25
    },
    chapterName: {
        fontFamily: 'product-sans-bold',
        fontSize: 20,
        marginBottom: 5
    },
    bookTitleAndAuthor: {
        fontFamily: 'product-sans',
        fontSize: 15,
        marginBottom: 20
    },
    audioSeekBar: {
        width: 250,
        height: 10
    }
});

export default ChapterPlayerPage;
