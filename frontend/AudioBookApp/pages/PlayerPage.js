import React from "react";
import {Audio} from 'expo-av';
import Slider from "react-native-slider";
import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {Icon} from "react-native-elements";
import * as Utils from '../utils/Utils';
import * as Segment from "expo-analytics-segment";
import UserSession from "../utils/UserSession";
import * as Amplitude from 'expo-analytics-amplitude';
import {BUTTON, CSI, EVENT, SCREEN} from "../utils/Track";

const format = require('string-format');
const BACKGROUND_COLOR = '#FFFFFF';

class PlayerPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    _createAudioSeekBar = () => {
        return (
            <Slider
                style={styles.audioSeekBar}
                value={this.state.playbackPercent}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={Utils.BLUE}
                thumbTintColor={Utils.BLUE}
                maximumTrackTintColor={Utils.GREY}
                onSlidingComplete={this._onAudioBarSeekComplete}
                onValueChange={this._onAudioBarSeeking}
                thumbStyle={styles.audioSeekBarThumb}
            />
        )
    };

    _createPlayPauseButton = () => {
        return (
            <View style={styles.playerControlIcon}>
                <TouchableHighlight onPress={this._onPlayPausePressed} underlayColor={BACKGROUND_COLOR}>
                    <Icon
                        type="material"
                        name={this._getPlayButton()}
                        size={50}
                        color="#000000"
                    />
                </TouchableHighlight>
            </View>
        )
    };

    _createSeekButton = (direction, duration) => {
        return (
            <View style={styles.playerControlIcon}>
                <Icon
                    type="material"
                    name={format("{0}-{1}", direction, '30')}
                    size={35}
                    color="#000000"
                    style={styles.playerControlIcon}
                    onPress={() => this._onSeekButtonPressed(direction)}
                />
            </View>
        )
    };

    _onPlayPausePressed = () => {
        if (this.state.playbackInstance == null) {
            //TODO: Log that we don't have a playback instance for some reason
            return;
        }

        if (this.state.playing) {
            Segment.trackWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.PAUSE
            });

            Amplitude.logEventWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.PAUSE,
                screenName: SCREEN.PLAYER_PAGE
            });

            this.state.playbackInstance.pauseAsync();
        } else {
            Segment.trackWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.PLAY
            });

            Amplitude.logEventWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.PLAY,
                screenName: SCREEN.PLAYER_PAGE
            });

            this.state.playbackInstance.playAsync();
        }
    };

    _getPlayButton() {
        if (this.state.shouldPlay) {
            return 'pause';
        }
        return 'play-arrow';
    }

    _onSeekButtonPressed = async (direction) => {
        let status = await this.state.playbackInstance.getStatusAsync();
        let position = status.positionMillis;

        this.state.seeking = true;
        //if (this.state.seekButtonTaps == 0) {
        //    this.state.seekPlayingStatus = this.state.playing;
        //}
        //this.state.seekButtonTaps += 1;

        if (direction === 'replay') {
            position -= 30 * Utils.SECOND_IN_MILLIS;
            Segment.trackWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.SEEK_BACKWARD
            });

            Amplitude.logEventWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.SEEK_BACKWARD,
                screenName: SCREEN.PLAYER_PAGE
            });
        } else if (direction === 'forward') {
            position += 30 * Utils.SECOND_IN_MILLIS;
            Segment.trackWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.SEEK_FORWARD
            });

            Amplitude.logEventWithProperties('EVENT', {
                type: EVENT.BUTTON_CLICKED,
                button: BUTTON.SEEK_FORWARD,
                screenName: SCREEN.PLAYER_PAGE
            });
        }

        this.setState({
            position: position
        });

        await this.state.playbackInstance.setPositionAsync(position);
        //await this._waitForPreSeekStatus();

        //this.state.seekButtonTaps -= 1;
        //if (this.state.seekButtonTaps == 0) {
        this.state.seeking = false;
        //}
    };

    _onAudioBarSeeking = async (value) => {
        //console.log('Updating audio bar seek value');
        this.state.seeking = true;
        this.state.seekPlayingStatus = this.state.playing;

        let status = await this.state.playbackInstance.getStatusAsync();
        let position = Math.floor(status.durationMillis * value);

        this.setState({
            position: position
        });
    };

    _onAudioBarSeekComplete = async (value) => {
        //console.log('Audio seek complete');
        this.state.seeking = true;
        this.state.seekPlayingStatus = this.state.playing;

        let status = await this.state.playbackInstance.getStatusAsync();

        let oldPosition = status.positionMillis;
        let newPosition = Math.floor(status.durationMillis * value);

        Segment.trackWithProperties('EVENT', {
            type: EVENT.SEEK_SLIDER,
            initialSeekPosition: oldPosition,
            finialSeekPosition: newPosition
        });

        Amplitude.logEventWithProperties('EVENT', {
            type: EVENT.SEEK_SLIDER,
            initialSeekPositionMillis: oldPosition,
            finalSeekPosition: newPosition,
            screenName: SCREEN.PLAYER_PAGE
        });

        //console.log('Setting Position');
        await this.state.playbackInstance.setPositionAsync(newPosition);

        this.state.seeking = false;
        //await this._waitForPreSeekStatus();

        // Wait for the player to resume playing before we set seeking to false
        //console.log('Audio bar seek complete, seeking is now False');
    };

    _waitForPreSeekStatus = async () => {
        if (this.state.seekPlayingStatus) {
            //console.log('Resuming playback');
            // Don't mark seeking as false until the Playback has resumed
            await this.state.playbackInstance.playAsync();
            await this._waitForPlaybackStatus(true);
        } else {
            //console.log('Pausing Playback');
            await this.state.playbackInstance.pauseAsync();
            await this._waitForPlaybackStatus(false);
        }
    };

    _waitForPlaybackStatus = async (isPlaying) => {
        while (true) {
            let status = await this.state.playbackInstance.getStatusAsync();
            if (status.isPlaying === isPlaying) {
                break;
            }
        }
    };

    _playbackStatusUpdate = (playbackStatus) => {

        //console.log('Playback status called');
        if (this.state.seeking) {
            //console.log('\tSeeking, not updating state');
            return;
        }

        if (playbackStatus.isLoaded) {
            //console.log('\tNot seeking, updating state. Playing: ' + playbackStatus.isPlaying);
            let playbackPercent = playbackStatus.positionMillis / playbackStatus.durationMillis;

            this.setState({
                position: playbackStatus.positionMillis,
                duration: playbackStatus.durationMillis,
                playing: playbackStatus.isPlaying,
                buffering: playbackStatus.isBuffering,
                shouldPlay: playbackStatus.shouldPlay,
                playbackPercent: playbackPercent
            });

            Segment.trackWithProperties('PLAYBACK_STATUS', playbackStatus);
            Amplitude.logEventWithProperties('PLAYBACK_STATUS', playbackStatus);

            //console.log('Playing: ' + this.state.playing);
            //console.log('Buffering ' + this.state.buffering);
            //console.log('Should Play ' + this.state.shouldPlay);
        }

        if (playbackStatus.error) {
            //TODO: Log that there was an error
        }
    };

    async componentDidMount() {
        UserSession.setSegmentIdentity();
        UserSession.setAmplitudeIdentity();

        let setupStartTime = Date.now();
        let book = this.props.navigation.getParam('book');
        let chapter = this.props.navigation.getParam('chapter');

        // Create initial structure of Player
        this.setState({
            book: book,
            chapter: chapter,
            playbackPercent: 0,
            seekButtonTaps: 0,
            position: 0,
            duration: 0,
            playing: true,
            buffering: false,
            seeking: false,
            shouldPlay: true
        });

        //Set up the Player and how long it takes to set up the player
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false
        });
        let setupEndTime = Date.now();

        Segment.trackWithProperties('CSI', {
            type: CSI.PLAYER_SETUP,
            timeMillis: (setupEndTime - setupStartTime)
        });
        Amplitude.logEventWithProperties('CSI', {
            type: CSI.PLAYER_SETUP,
            timeMillis: (setupEndTime - setupEndTime)
        });


        Segment.screenWithProperties(SCREEN.PLAYER_PAGE, {
            bookData: {
                bookID: book.getID(),
                bookTitle: book.getTitle()
            },
            chapterData: {
                chapterID: chapter.getID(),
                chapterTitle: chapter.getTitle()
            }
        });
        Amplitude.logEventWithProperties('EVENT', {
            type: EVENT.SCREEN_IMPRESSION,
            screenName: SCREEN.PLAYER_PAGE,
            bookData: {
                bookID: book.getID(),
                bookTitle: book.getTitle()
            },
            chapterData: {
                chapterID: chapter.getID(),
                chapterTitle: chapter.getTitle()
            }
        });

        // Load Audio and log how long it takes
        let startTime = Date.now();
        this.loadAudio().then(() => {
            let endTime = Date.now();
            Segment.trackWithProperties('CSI', {
                type: CSI.AUDIO_LOADED,
                timeMillis: (endTime - startTime)
            });

            Amplitude.logEventWithProperties('CSI', {
                type: CSI.AUDIO_LOADED,
                timeMillis: (endTime - startTime)
            })
        });
    }

    async loadAudio() {
        try {
            // AppSettings for the playback instance
            let source = {
                uri: this.state.chapter.state.audioURL
            };
            let status = {
                shouldPlay: true,
                volume: 1.0
            };

            // Create Playback instance
            let playbackInstance = new Audio.Sound();
            await playbackInstance.loadAsync(source, status, false);
            playbackInstance.setOnPlaybackStatusUpdate(this._playbackStatusUpdate);

            // Keep track of the playback instance
            this.setState({
                playbackInstance: playbackInstance,
            });


        } catch (e) {
            //TODO: Better logging of playback initiation errors
            console.log(e);
        }
    }

    async componentWillUnmount() {
        // Unload the playback instance
        if (this.state.playbackInstance != null) {
            await this.state.playbackInstance.unloadAsync();
        } else {
            //TODO Log why there isn't a playback instance here
        }
    }

    render() {
        //console.log('rendering');
        //console.log('Playing: ' + this.state.playing);
        //console.log('Buffering ' + this.state.buffering);
        //console.log('Play button shape ' + this._getPlayButton());

        if (this.state.chapter == null) {
            return null;
        }

        //console.log(this.state.chapter.state);

        return (
            <View>
                <View style={styles.chapterPlayer}>
                    <View style={styles.bookDetails}>
                        <Image style={styles.albumArt} source={{uri: this.state.book.getImageURL()}}
                               resizeMode='contain'/>
                    </View>
                    <View style={styles.audioPlayer}>
                        <Text style={styles.chapterName}>{this.state.chapter.state.title}</Text>
                        <Text
                            style={styles.bookTitleAndAuthor}>{this.state.book.state.title} · {this.state.book.state.author}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                            <View
                                style={{paddingRight: 10}}><Text>{Utils.millisToString(this.state.position)}</Text></View>
                            <View style={{alignItems: 'center'}}>
                                {this._createAudioSeekBar()}
                            </View>
                            <View
                                style={{paddingLeft: 10}}><Text>{Utils.millisToString(this.state.duration)}</Text></View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {this._createSeekButton('replay', 30)}
                            {this._createPlayPauseButton()}
                            {this._createSeekButton('forward', 30)}
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
        alignItems: 'stretch',
        paddingLeft: 25,
        paddingRight: 25
    },
    bookDetails: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioPlayer: {
        flex: 4,
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    albumArt: {
        width: '75%',
        height: '75%',
        marginBottom: 10
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
        height: 20,
    },
    audioSeekBarThumb: {
        width: 15,
        height: 15
    },
    playerControlIcon: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: BACKGROUND_COLOR,
    }
});

export default PlayerPage;
