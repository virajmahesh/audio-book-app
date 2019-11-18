import React from "react";
import {ActivityIndicator, Dimensions, FlatList, StatusBar, StyleSheet, Text, View} from "react-native";
import {withNavigation} from 'react-navigation';

import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Book} from "./Book";
import * as Settings from './Settings';
import * as Utils from './Utils';

const format = require('string-format');

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            booksLoaded: false,
            bookList: [],
            refreshing: false
        };
    }

    componentDidMount() {
        this.loadFonts();
        this.loadHomePageBooks();
    }

    onRefresh = async () => {
        await this.setState({
            refreshing: true,
            bookList: []
        });
        await this.loadHomePageBooks();
        this.setState({
            refreshing: false
        });
    };

    async loadFonts() {
        await Font.loadAsync({
            'product-sans': require('./assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('./assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('./assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('./assets/fonts/ProductSansBoldItalic.ttf'),
        });

        this.setState({
            fontsLoaded: true
        });
    }

    async loadHomePageBooks() {
        // TODO: Log errors from fetching home data
        let offset = this.state.bookList.length;
        this.setState({
            booksLoaded: false
        });

        await fetch(format(Settings.HOME_API_ENDPOINT, offset))
            .then((response => response.json()))
            .then((responseJSON) => {
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
            <Text style={styles.homePageTitle} key='titleText'>
                Classic Audiobooks
            </Text>
        )
    }

    render() {
        //TODO: Log Home Activity startup time
        if (!this.state.fontsLoaded) {
            return <AppLoading/>;
        }

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
                                  ListHeaderComponent={HomeScreen.pageTitleComponent()}
                                  ListFooterComponent={Utils.loadingIndicator()}
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

export default withNavigation(HomeScreen);
