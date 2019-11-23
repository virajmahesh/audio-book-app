import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from "./Home";
import AuthPage from "./AuthPage";
import SplashPage from "./SplashPage";
import BookDetailsPage from "./BookDetailsPage";
import ChapterPlayerPage from "./ChapterPlayer";
import { SettingsPage } from "./SettingsPage";

const MainNavigator = createStackNavigator({
    Splash: {screen: SplashPage},
    Home: {screen: HomePage},
    BookDetails: {screen: BookDetailsPage},
    ChapterPlayer: {screen: ChapterPlayerPage},
    Auth: {screen: AuthPage},
    Settings: {screen: SettingsPage},
});

const App = createAppContainer(MainNavigator);
export default App;