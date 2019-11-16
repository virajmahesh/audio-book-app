import React from "react";
import {Audio} from 'expo-av';
import {TouchableHighlight, StyleSheet, Text, View, Image, Slider} from "react-native";
import {Icon} from "react-native-elements";
import * as Util from './Utils';

const format = require('string-format');

const BACKGROUND_COLOR = '#eeeeee';
const BLUE_TINT = '#0074CD';
const GREY_TINT = '#D7D7D7';

class ChapterPlayerPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static navigationOptions = {
        header: null
    };

    _createAudioSeekBar = () => {
        return (
            <Slider
              style={styles.audioSeekBar}
              value={this.state.playbackPercent}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={BLUE_TINT}
              thumbTintColor={BLUE_TINT}
              maximumTrackTintColor={GREY_TINT}
              onSlidingComplete={this._onAudioBarSeekComplete}
              onValueChange={this._onAudioBarSeeking}
            />
        )
    }

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
    }

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
    }

    _onPlayPausePressed = () => {
        if (this.state.playbackInstance == null) {
            //TODO: Log that we don't have a playback instance for some reason
            return;
        }

        if (this.state.playing) {
            this.state.playbackInstance.pauseAsync();
        }
        else {
            this.state.playbackInstance.playAsync();
        }
    }

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

        if (direction == 'replay') {
            position -= 30 * Util.SECOND_IN_MILLIS;
        }
        else if (direction == 'forward') {
            position += 30 * Util.SECOND_IN_MILLIS;
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
    }

    _onAudioBarSeeking = async (value) => {
        console.log('Updating audio bar seek value');
        this.state.seeking = true;
        this.state.seekPlayingStatus = this.state.playing;

        let status = await this.state.playbackInstance.getStatusAsync();
        let position = Math.floor(status.durationMillis * value);

        this.setState({
            position: position
        });
    }

    _onAudioBarSeekComplete = async (value) => {
        console.log('Audio seek complete');
        this.state.seeking = true;
        this.state.seekPlayingStatus = this.state.playing;

        let status = await this.state.playbackInstance.getStatusAsync();
        let position = Math.floor(status.durationMillis * value);

        console.log('Setting Position');
        await this.state.playbackInstance.setPositionAsync(position);

        this.state.seeking = false;
        //await this._waitForPreSeekStatus();

        // Wait for the player to resume playing before we set seeking to false
        console.log('Audio bar seek complete, seeking is now False');
    }

    _waitForPreSeekStatus = async() => {
        if (this.state.seekPlayingStatus) {
            console.log('Resuming playback');
            // Don't mark seeking as false until the Playback has resumed
            await this.state.playbackInstance.playAsync();
            await this._waitForPlaybackStatus(true);
        }
        else {
              console.log('Pausing Playback');
              await this.state.playbackInstance.pauseAsync();
              await this._waitForPlaybackStatus(false);
        }
    }

    _waitForPlaybackStatus = async (isPlaying) => {
        while (true) {
            let status = await this.state.playbackInstance.getStatusAsync();
            if (status.isPlaying == isPlaying) {
                break;
            }
        }
    }

    _playbackStatusUpdate = (playbackStatus) => {

        console.log('Playback status called');
        if (this.state.seeking) {
            console.log('\tSeeking, not updating state');
            return;
        }

        if (playbackStatus.isLoaded) {
            console.log('\tNot seeking, updating state. Playing: ' + playbackStatus.isPlaying);
            let playbackPercent = playbackStatus.positionMillis / playbackStatus.durationMillis;

            this.setState({
                position: playbackStatus.positionMillis,
                duration: playbackStatus.durationMillis,
                playing: playbackStatus.isPlaying,
                buffering: playbackStatus.isBuffering,
                shouldPlay: playbackStatus.shouldPlay,
                playbackPercent: playbackPercent
            });

            console.log('Playing: ' + this.state.playing);
            console.log('Buffering '+ this.state.buffering);
            console.log('Should Play ' + this.state.shouldPlay);
          }

        if (playbackStatus.error) {
          //TODO: Log that there was an error
        }
    }

    async componentDidMount() {
        // Create initial structure of Player
        this.setState({
            book: this.props.navigation.getParam('book'),
            chapter: this.props.navigation.getParam('chapter'),
            playbackPercent: 0,
            seekButtonTaps: 0,
            position: 0,
            duration: 0,
            playing: true,
            buffering: false,
            seeking: false,
            shouldPlay: true
        });

        //TODO: Log that player setup was started
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false
        });

        // TODO: Log the amount of time it takes to start the playback
        this.loadAudio();
    }

    async loadAudio() {
        try {
            // Settings for the playback instance
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
            this.state.playbackInstance.unloadAsync();
        }
        else {
          //TODO Log why there isn't a playback instance here
        }
    }

    render() {
        console.log('rendering');
        console.log('Playing: ' + this.state.playing);
        console.log('Buffering '+ this.state.buffering);
        //console.log('Play button shape ' + this._getPlayButton());

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
                            <View><Text>{Util.millisToString(this.state.position)}</Text></View>
                            <View style={{alignItems: 'center'}}>
                                {this._createAudioSeekBar()}
                            </View>
                            <View><Text>{Util.millisToString(this.state.duration)}</Text></View>
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
        height: 20,
    },
    playerControlIcon: {
      marginLeft: 10,
      marginRight: 10,
      backgroundColor: '#eeeeee',
    }
});

export default ChapterPlayerPage;
