import React from "react";
import AuthSessionManager from "../utils/AuthSessionManager";
import {withNavigation} from 'react-navigation';
import * as Segment from 'expo-analytics-segment';
import * as Font from "expo-font";
import * as Utils from '../utils/Utils';
import * as AppSettings from '../utils/AppSettings';
import {CSI, SCREEN} from "../utils/Track";
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

    componentDidMount() {
        this.loadFonts();
        this.loadLoginInfo();

        Segment.initialize({
            androidWriteKey: AppSettings.Segment.ANDROID_WRITE_KEY,
            iosWriteKey: AppSettings.Segment.IOS_WRITE_KEY
        });

        AuthSessionManager.setSegmentIdentity();
        Segment.screen(SCREEN.SPLASH_PAGE);

        if (this.state.authStateLoaded && this.state.fontsLoaded) {
            this.redirectToApp();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.authStateLoaded || !this.state.fontsLoaded) {
            return;
        }

        SplashScreen.hide();
        this.redirectToApp();
    }

    redirectToApp() {
        if (AuthSessionManager.isLoggedIn()) {

            this.props.navigation.dispatch(
                Utils.resetNavigation('HomePage')
            );
        } else {
            this.props.navigation.dispatch(
                Utils.resetNavigation('AuthPage')
            );
        }
    }

    async loadLoginInfo() {
        await AuthSessionManager.loadLoginInfo();
        this.setState({
            authStateLoaded: true
        })
    }

    async loadFonts() {
        //TODO: Log how long it takes to load fonts
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

        this.setState({
            fontsLoaded: true
        });
    }

    render() {
        return null;
    }


}

export default SplashPage;