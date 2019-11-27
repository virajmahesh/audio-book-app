import React from "react";

import {Dimensions, FlatList, StatusBar, StyleSheet, Text, View, SafeAreaView} from "react-native";
import {withNavigation} from 'react-navigation';
import {Book} from "../components/Book";
import * as AppSettings from '../utils/AppSettings';
import * as Utils from '../utils/Utils';
import {EVENT, SCREEN} from '../utils/Track';
import {ProfileHeader} from "./SettingsPage";
import * as Segment from 'expo-analytics-segment';
import UserSession from "../utils/UserSession";

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

    componentDidMount() {
        UserSession.setSegmentIdentity();
        UserSession.setAmplitudeIdentity();

        Segment.screen(SCREEN.HOME_PAGE);

        this.loadHomePageBooks();
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

        Segment.trackWithProperties('EVENT', {
            type: EVENT.PULL_DOWN_TO_REFRESH
        });

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

    render() {
        return (
            <SafeAreaView style={{flex: 1, marginTop: 30}}>
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
            </SafeAreaView>
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
