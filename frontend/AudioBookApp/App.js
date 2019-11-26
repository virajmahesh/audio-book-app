import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SplashPage from "./pages/SplashPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import ChapterPlayerPage from "./pages/PlayerPage";
import { SettingsPage } from "./pages/SettingsPage";

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