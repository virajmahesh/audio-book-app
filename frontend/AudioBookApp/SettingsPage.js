import React from "react";

import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {withNavigation} from 'react-navigation';
import AuthSessionManager from "./AuthSessionManager";
import {Icon} from "react-native-elements";

import * as AppSettings from './AppSettings';


@withNavigation
class SettingsPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    async logOut() {
        await AuthSessionManager.logOut();
        this.props.navigation.navigate('Auth');
    }

    render() {
        return (
            <View>
                <View style={{paddingTop: 30, paddingLeft: 20, paddingRight: 20}}>
                    <View style={{flexDirection: 'row', marginBottom: 15}}>
                        <Image source={{uri: AuthSessionManager.getProfileImageURL()}}
                               style={{width: 60, height: 60, borderRadius: 30, marginRight: 15}}/>
                        <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={styles.fullName}>{AuthSessionManager.getFullName()}</Text>
                            <Text style={styles.email}>{AuthSessionManager.getEmail()}</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableHighlight
                            onPress={() => this.logOut()}>
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 50}}>
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
                            <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 50}}>
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
                    onPress={() => this.props.navigation.navigate('Settings')}
                    style={{borderRadius: 15}}>
                    <Image source={{uri: AuthSessionManager.getProfileImageURL()}}
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