import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomePage from "./Home";
import AuthPage from "./AuthPage";
import BookDetailsPage from "./BookDetailsPage";
import ChapterPlayerPage from "./ChapterPlayer";

const MainNavigator = createStackNavigator({
    Home: {screen: HomePage},
    BookDetails: {screen: BookDetailsPage},
    ChapterPlayer: {screen: ChapterPlayerPage},
    Auth: {screen: AuthPage},
});

const App = createAppContainer(MainNavigator);
export default App;