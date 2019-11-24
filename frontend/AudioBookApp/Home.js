import React from "react";

import {Dimensions, FlatList, StatusBar, StyleSheet, Text, View} from "react-native";
import {withNavigation} from 'react-navigation';
import {Book} from "./Book";
import * as AppSettings from './AppSettings';
import * as Utils from './Utils';
import * as Event from './Event';
import {ProfileHeader} from "./SettingsPage";
import * as Segment from 'expo-analytics-segment';

const format = require('string-format');

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

@withNavigation
class HomePage extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            booksLoaded: false,
            bookList: [],
            refreshing: false,
            loadedAuthState: false
        };
    }

    screenName() {
        return 'HOME_PAGE';
    }

    componentDidMount() {
        this.loadHomePageBooks();

        Utils.identify();
        Segment.screen(this.screenName());
    }

    onRefresh = async () => {
        let refreshStartTime = Date.now();
        await this.setState({
            refreshing: true,
            bookList: []
        });
        await this.loadHomePageBooks();

        let refreshEndTime = Date.now();
        let refreshTime = refreshEndTime - refreshStartTime;

        Segment.trackWithProperties(
            Event.PULL_DOWN_TO_REFRESH,
            {refreshTimeMillis: refreshTime});

        this.setState({
            refreshing: false
        });
    };

    async loadHomePageBooks() {
        // TODO: Log errors from fetching home data
        let offset = this.state.bookList.length;
        this.setState({
            booksLoaded: false
        });

        await fetch(format(AppSettings.HOME_API_ENDPOINT, offset))
            .then((response => response.json()))
            .then((responseJSON) => {
                // TODO: Log how long it takes to fetch the home page
                let bookList = this.state.bookList;

                // Parse the JSON response and create Book objects
                responseJSON.forEach((b => {
                    b.key = 'Book: ' + b.id.toString();
                    bookList.push(React.createElement(Book, b));
                }));

                // Update the app state with the new book list
                this.setState({
                    booksLoaded: true
                });
            });
    }

    static pageTitleComponent() {
        return (
            <View>
                <ProfileHeader/>
                <Text style={styles.homePageTitle} key='titleText'>
                    Classic Audiobooks
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.homePage} key='titleView'>
                    <View>
                        <FlatList data={this.state.bookList}
                                  renderItem={({item}) => item}
                                  numColumns={3}
                                  key='bookShelf'
                                  keyExtractor={(item, index) => index.toString()}
                                  onEndReached={() => this.loadHomePageBooks()}
                                  showsVerticalScrollIndicator={false}
                                  onEndReachedThreshold={0.25}
                                  ListHeaderComponent={HomePage.pageTitleComponent()}
                                  ListFooterComponent={Utils.loadingIndicator(!this.state.refreshing)}
                                  refreshControl={Utils.createRefreshControl(this.state.refreshing, this.onRefresh)}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    homePage: {
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        backgroundColor: '#fff',
    },
    homePageTitle: {
        fontSize: 32,
        padding: 25,
        textAlign: 'center',
        fontFamily: 'product-sans-bold',
    },
    bookShelfHome: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
});

export default HomePage;
