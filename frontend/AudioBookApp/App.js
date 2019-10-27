import React from 'react';
import {StatusBar, StyleSheet, Text, View, ScrollView} from 'react-native';
import GeneralStatusBarColor from "react-native-general-statusbar";


console.log('statusBarHeight: ', StatusBar.currentHeight);
console.log('statusBarHeight: ', StatusBar.currentHeight * 1.25);

const bookMargin = '1.75%';

console.log(bookMargin);

function Book(props) {
    return (
        <View style={styles.book}>
            <View style={styles.albumArt}/>
            <View style={styles.bookMetadata}>
                <Text>{props.title}</Text>
                <Text>{props.author}</Text>
            </View>
        </View>
    )
}

export default function App() {
    var bookShelves = [];
    for (let i = 0; i < 10; i++) {
      bookShelves.push(
        <View style={styles.bookShelfHome}>
            <Book title='Frankenstein' author='Mary Shelly'/>
            <Book title='Frankenstein' author='Mary Shelly'/>
            <Book title='Frankenstein' author='Mary Shelly'/>
        </View>
      )
    }

    return (
        <View style={{flex: 1}}>
            <GeneralStatusBarColor backgroundColor="#ffffff" barStyle="light-content"/>
          <View style={styles.homePage}>
            <ScrollView>
                <View style={styles.homePageTitle}/>
                {bookShelves}
            </ScrollView>
          </View>
        </View>
    );
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
    homePageTitle: {
      width: '100%',
      height: StatusBar.currentHeight + 20,
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
