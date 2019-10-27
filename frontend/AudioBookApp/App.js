import React from 'react';
import * as Font from 'expo-font';
import {StatusBar, StyleSheet, Text, View, ScrollView} from 'react-native';
import {AppLoading} from 'expo';

console.log('statusBarHeight: ', StatusBar.currentHeight);
console.log('statusBarHeight: ', StatusBar.currentHeight * 1.25);

const bookMargin = '1.75%';

console.log(bookMargin);

function Book(props) {
    return (
        <View style={styles.book}>
            <View style={styles.albumArt}/>
            <View style={styles.bookMetadata}>
                <Text style={styles.bookMetadataText}>{props.title}</Text>
                <Text style={styles.bookMetadataText}>{props.author}</Text>
            </View>
        </View>
    )
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false
        };
        console.log('Constructor: ' + this.state.fontsLoaded);
    }

    async loadFonts() {
        await Font.loadAsync({
            'product-sans': require('./assets/fonts/ProductSansRegular.ttf'),
            'product-sans-bold': require('./assets/fonts/ProductSansBold.ttf'),
            'product-sans-italic': require('./assets/fonts/ProductSansItalic.ttf'),
            'product-sans-bold-italic': require('./assets/fonts/ProductSansBoldItalic.ttf'),
        });
    }

    render() {
        //TODO: Log App startup time
        if (!this.state.fontsLoaded) {
            return <AppLoading
                startAsync={this.loadFonts}
                onFinish={() => this.setState({fontsLoaded: true}) }
            />;
        }

        let bookShelves = [];
        for (let i = 0; i < 10; i++) {
            bookShelves.push(
                <View style={styles.bookShelfHome} key={(i * 10) + 4}>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 1}/>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 2}/>
                    <Book title='Frankenstein' author='Mary Shelly' key={(i * 10) + 3}/>
                </View>
            )
        }

        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.homePage}>
                    <ScrollView>
                        <Text style={styles.homePageTitle} key={99}>Classic Audiobooks</Text>
                        {bookShelves}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    homePage: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: bookMargin,
        paddingRight: bookMargin,
        marginLeft: 0,
        marginRight: 0,
    },
    bookMetadataText: {
        fontFamily: 'product-sans',
    },
    homePageTitle: {
        fontSize: 32,
        fontFamily: 'product-sans-bold',
        padding: 20,
        textAlign: 'center',
    },
    bookShelfHome: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 0,
        marginLeft: 0,
        marginBottom: 20
    },
    book: {
        width: '30%',
        height: 200,
        marginLeft: bookMargin,
        marginRight: bookMargin,
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 5,
    },
    albumArt: {
        borderColor: 'red',
        height: '80%',
        backgroundColor: 'blue',
        borderWidth: 2,
    },
    bookMetadata: {
        borderColor: 'green',
        borderWidth: 2,
        height: '20%',
        backgroundColor: 'orange',
    }
});
