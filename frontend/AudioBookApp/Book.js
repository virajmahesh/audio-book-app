import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
import {Icon} from "react-native-elements";
import { withNavigation } from 'react-navigation';
import {CHAPTER_API_ENDPOINT} from './Settings';

const format = require('string-format');
const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;


@withNavigation
class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            title: props.title,
            author: props.author,
            description: props.description,
            imageURL: props.primary_image_url,
            secondaryImageURL: props.secondary_image_url
        };
        props.key = props.id;
    }

    getImageURL() {
        return this.state.imageURL;
    }

    async loadChapters() {
      await fetch(format(CHAPTER_API_ENDPOINT, this.state.id))
        .then((response => response.json()))
        .then((responseJSON) => {
            let chapterList = []

            responseJSON.forEach((c => {
              c.book = this; // Insert a reference to the book in the Chapter object
              chapterList.push(React.createElement(Chapter, c))
            }));

            // Update the book state with the new book list
            this.setState({
                chapterList: chapterList,
                chaptersLoaded: true
            });
        });
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('BookDetails', {'book': this})}
                style={styles.book}>
                <View style={{backgroundColor: 'white'}}>
                    <Image style={styles.albumArt} source={{uri: this.getImageURL()}} resizeMode='stretch'/>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookMetadataText} numberOfLines={1}>{this.state.title}</Text>
                        <Text style={styles.bookMetadataText} numberOfLines={1}>{this.state.author}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

@withNavigation
class Chapter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          id: props.id,
          title: props.title,
          audioURL: props.audio_url,
          book: props.book
        };
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('ChapterPlayer', {
                    book: this.state.book,
                    chapter: this
                })}>

                <View style={chapterStyle(this.props.isLastChapter)}>
                    <View style={styles.chapterTitle}>
                        <Text style={{fontFamily: 'product-sans-bold', fontSize: 15}}>{this.state.title}</Text>
                    </View>
                    <View style={styles.playIcon}>
                        <Icon type="material" name="play-circle-outline" color="#000000"/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

function chapterStyle(isLastChapter) {
    return {
        borderBottomWidth: (isLastChapter) ? 0 : 1,
        height: 55,
        width: '100%',
        borderColor: '#eaeaea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    }
}

const styles = StyleSheet.create({
    book: {
        width: '30%',
        height: 200,
        marginLeft: '1.666%',
        marginRight: '1.666%',
        marginBottom: 15,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    albumArt: {
        height: '80%',
        marginBottom: 5,
        backgroundColor: 'white'
    },
    bookMetadata: {
        height: '20%',
        backgroundColor: 'white'
    },
    bookMetadataText: {
        fontSize: 14,
        fontFamily: 'product-sans',
        backgroundColor: 'white'
    },

    //TODO: Clean up Chapter styles and rendereding logic
    chapterTitle: {
        flex: 0.9
    },
    playIcon: {
        flex: 0.1,
    },
    chapterTouch: {

    }
});

export {Book, Chapter};
