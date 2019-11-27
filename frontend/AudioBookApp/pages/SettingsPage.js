import React from "react";

import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {withNavigation} from 'react-navigation';
import UserSession from "../utils/UserSession";
import {Icon} from "react-native-elements";
import * as Amplitude from 'expo-analytics-amplitude';
import * as AppSettings from '../utils/AppSettings';
import {BUTTON, EVENT, SCREEN} from '../utils/Track';
import * as Segment from "expo-analytics-segment";


@withNavigation
class SettingsPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        UserSession.setSegmentIdentity();
        UserSession.setAmplitudeIdentity();

        Segment.screen(SCREEN.SETTINGS_PAGE);

        Amplitude.logEventWithProperties('EVENT', {
            type: EVENT.SCREEN_IMPRESSION,
            screenName: SCREEN.SETTINGS_PAGE
        });
    }

    async logOut() {
        Segment.trackWithProperties('EVENT', {
            type: EVENT.BUTTON_CLICKED,
            button: BUTTON.SIGN_OUT
        });

        Amplitude.logEventWithProperties('EVENT', {
            type: EVENT.BUTTON_CLICKED,
            button: BUTTON.SIGN_OUT,
            screenName: SCREEN.SETTINGS_PAGE
        });

        await UserSession.logOut();
        this.props.navigation.navigate('AuthPage');
    }

    render() {
        return (
            <View>
                <View style={{paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <Image source={{uri: UserSession.getProfileImageURL()}}
                               style={{width: 60, height: 60, borderRadius: 30, marginRight: 15}}/>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={styles.fullName}>{UserSession.getFullName()}</Text>
                            <Text style={styles.email}>{UserSession.getEmail()}</Text>
                        </View>
                    </View>
                    <View>

                        <TouchableHighlight
                            onPress={() => this.logOut()}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                height: 50
                            }}>
                                <View style={styles.settingsIcon}>
                                    <Icon
                                        type="material-community"
                                        name="logout-variant"
                                        size={25}
                                        color={AppSettings.GREY}
                                        onPress={() => this._onSeekButtonPressed(direction)}
                                    />
                                </View>
                                <Text style={styles.settingsText}>Sign out</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => console.log('clicked')}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                height: 50
                            }}>
                                <View style={styles.settingsIcon}>
                                    <Icon
                                        type="material"
                                        name="monetization-on"
                                        size={25}
                                        color={AppSettings.GREY}
                                        onPress={() => this._onSeekButtonPressed(direction)}
                                    />
                                </View>
                                <Text style={styles.settingsText}>Manage membership</Text>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>
            </View>
        );
    }
}

@withNavigation
class ProfileHeader extends React.Component {
    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                <TouchableHighlight
                    onPress={() => this.props.navigation.navigate('SettingsPage')}
                    style={{borderRadius: 15}}>
                    <Image source={{uri: UserSession.getProfileImageURL()}}
                           style={{width: 30, height: 30, borderRadius: 15}}/>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fullName: {
        fontFamily: 'product-sans',
        fontSize: 24,
    },
    email: {
        fontFamily: 'product-sans'
    },
    settingsIcon: {
        paddingRight: 10
    },
    settingsText: {
        fontFamily: 'product-sans',
        fontSize: 18
    }
});

export {ProfileHeader, SettingsPage};