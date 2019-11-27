import * as Google from "expo-google-app-auth";
import * as AppSettings from "./AppSettings";
import * as Utils from './Utils';
import * as Amplitude from 'expo-analytics-amplitude';
import {EVENT, SIGN_IN_PROVIDERS} from './Track';
import * as SecureStore from "expo-secure-store";
import {withNavigation} from 'react-navigation';
import Constants from "expo-constants";
import * as Segment from "expo-analytics-segment";


@withNavigation
export default class UserSession {

    static config = {
        androidClientId: AppSettings.Google.ANDROID_CLIENT_ID_DEV,
        androidStandaloneAppClientId: AppSettings.Google.ANDROID_CLIENT_ID_PROD,
        iosClientId: AppSettings.Google.IOS_CLIENT_ID_DEV,
        iosStandaloneAppClientId: AppSettings.Google.IOS_CLIENT_ID_PROD,
        scopes: ['profile', 'email']
    };

    static state = {
        isLoggedIn: false
    };

    static async loginWithGoogle() {
        console.log('LOGIN');
        const {type, accessToken, user} = await Google.logInAsync(UserSession.config);

        Segment.trackWithProperties('EVENT', {
            type: EVENT.SIGN_IN_COMPLETE,
            signInStatus: type,
            signInProvider: SIGN_IN_PROVIDERS.GOOGLE
        });

        console.log(type);

        if (type === 'success') {
            console.log(UserSession.state);
            UserSession.state.accessToken3P = accessToken;
            UserSession.state.user = {
                firstName: user.givenName,
                lastName: user.familyName,
                googleID: user.id,
                profileImageURL: user.photoUrl,
                email: user.email,
                backend: 'google',
                installationID: Constants.installationId
            };
            UserSession.state.backend = 'Google';
            UserSession.state.isLoggedIn = true;

            await UserSession.get1PTokens();
            await UserSession.saveLoginInfo();
        }
    }

    static hasGoogleToken() {
        return UserSession.state.accessToken3P !== null || UserSession.state.backend === 'google'
    }

    static hasFacebookToken() {

    }

    static has1PAccessToken() {

    }

    static isLoggedIn() {
        return UserSession.state !== null && UserSession.state.isLoggedIn;
    }

    static getState() {
        return UserSession.state;
    }

    static getProfileImageURL() {
        return UserSession.state.user.profileImageURL;
    }

    static getFirstName() {
        return UserSession.state.user.firstName;
    }

    static getLastName() {
        return UserSession.state.user.lastName;
    }

    static getUserID() {
        return UserSession.state.user.userID1P;
    }

    static getFullName() {
        return UserSession.getFirstName() + ' ' + UserSession.getLastName();
    }

    static getEmail() {
        return UserSession.state.user.email;
    }

    static getUser() {
        return UserSession.state.user;
    }

    static async logOut() {
        UserSession.state = {};
        await UserSession.saveLoginInfo();
    }

    static setSegmentIdentity() {
        if (!UserSession.isLoggedIn()) {
            Segment.identify(Constants.installationId);
        }
        else {
            Segment.identifyWithTraits(
                UserSession.getEmail(),
                UserSession.getUser()
            );
        }
    }

    static async setAmplitudeIdentity() {
        if (!UserSession.isLoggedIn()) {
            console.log('LOG IN STATUS' + UserSession.state);
            await Amplitude.setUserId(Constants.installationId);
        }
        else {
            Amplitude.setUserId(UserSession.getEmail()).then(async () => {
               await Amplitude.setUserProperties(UserSession.getUser());
            });
        }
    }

    static async get1PTokens() {
        if (this.hasGoogleToken()) {
            let requestBody = Utils.queryString({
                grant_type: 'convert_token',
                client_id: AppSettings.AUTH_CLIENT_ID,
                client_secret: AppSettings.AUTH_CLIENT_SECRET,
                backend: 'google-oauth2',
                token: UserSession.state.accessToken3P
            });

            //TODO: Log how long this request takes
            await fetch(AppSettings.SOCIAL_AUTH_API_ENDPOINT, {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            })
                .then((response => response.json()))
                .then((responseJson) => {
                    UserSession.state.accessToken1P = responseJson.access_token;
                    UserSession.state.refreshToken1P = responseJson.refresh_token;
                    UserSession.state.user.userID1P = responseJson.user_id.toString();
                });
        }
    }

    static async saveLoginInfo() {
        await SecureStore.setItemAsync('STATE', JSON.stringify(UserSession.state));
    }

    static async loadLoginInfo() {
        UserSession.state = JSON.parse(await SecureStore.getItemAsync('STATE'));

        if (UserSession.state === {} || UserSession.state === null) {
            //TODO: Log that there was no state to load
            UserSession.state = {isLoggedIn: false};
        }
    }
}