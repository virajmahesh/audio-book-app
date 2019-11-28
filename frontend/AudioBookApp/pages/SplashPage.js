import React from "react";
import UserSession from "../utils/UserSession";
import {withNavigation} from 'react-navigation';
import * as Segment from 'expo-analytics-segment';
import * as Font from "expo-font";
import * as Utils from '../utils/Utils';
import * as AppSettings from '../utils/AppSettings';
import * as Amplitude from 'expo-analytics-amplitude';
import {CSI, EVENT, SCREEN} from "../utils/Track";
import {SplashScreen} from "expo";

@withNavigation
class SplashPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            authStateLoaded: false
        };

        SplashScreen.preventAutoHide();
    }

    async componentDidMount() {
        await this.loadFonts();
        await this.loadLoginInfo();

        Segment.initialize({
            androidWriteKey: AppSettings.Segment.ANDROID_WRITE_KEY,
            iosWriteKey: AppSettings.Segment.IOS_WRITE_KEY
        });

        UserSession.setSegmentIdentity();

        await Amplitude.initialize(AppSettings.Amplitude.API_KEY);
        UserSession.setAmplitudeIdentity();

        Amplitude.logEventWithProperties('EVENT', {
            type: EVENT.SCREEN_IMPRESSION,
            screenName: SCREEN.SPLASH_PAGE
        });

       Segment.screen(SCREEN.SPLASH_PAGE);

        SplashScreen.hide();
        this.redirectToApp();
    }

    redirectToApp() {
        if (UserSession.isLoggedIn()) {
            this.props.navigation.dispatch(
                Utils.resetNavigation('HomePage')
            );
        }
        else {
            this.props.navigation.dispatch(
                Utils.resetNavigation('AuthPage')
            );
        }
    }

    async loadLoginInfo() {
        await UserSession.loadLoginInfo();
        this.setState({
            authStateLoaded: true
        })
    }

    async loadFonts() {
        if (this.state.fontsLoaded) {
            return;
        }

        let startTime = Date.now();

        await Font.loadAsync({
            'product-sans': require('../assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('../assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('../assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('../assets/fonts/ProductSansBoldItalic.ttf'),
        });

        let endTime = Date.now();

        Segment.trackWithProperties('CSI', {
            type: CSI.FONTS_LOADED,
            timeMillis: (endTime - startTime)
        });

        Amplitude.logEventWithProperties('CSI', {
           type: CSI.FONTS_LOADED,
           timeMillis: (endTime - startTime)
        });

        this.setState({
            fontsLoaded: true
        });
    }

    render() {
        return null;
    }


}

export default SplashPage;