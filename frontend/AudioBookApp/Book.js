import React from "react";
import {Dimensions, StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
import {Icon} from "react-native-elements";
import { withNavigation } from 'react-navigation';

const width = Dimensions.get('window').width;
const bookMargin = width * 0.02;

const OPEN_LIBRARY_IMAGE_URL =  'http://covers.openlibrary.org/b/isbn/';
const GOODREADS_REGEX_MATCH = /\._(SY|SX)(\d+)_\./gm;

@withNavigation
class Book extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            book_id: props.book,
            goodreads_id: props.goodreads_id,
            title: props.title,
            author: props.author,
            description: props.description,
            isbn: props.isbn,
            isbn13: props.isbn13,
            imageURL: props.image_url,
        };
        props.key = this.state.book_id;
    }

    getImageURL() {
        if (this.state.isbn !== '' || this.state.isbn13 !== '') {
            let isbn = (this.state.isbn !== '')? this.state.isbn : this.state.isbn13;
            console.log(OPEN_LIBRARY_IMAGE_URL + isbn + '-M.jpg');
            return OPEN_LIBRARY_IMAGE_URL + isbn + '-M.jpg';
        }
        console.log(this.state.imageURL.replace(GOODREADS_REGEX_MATCH, '.'));
        return this.state.imageURL.replace(GOODREADS_REGEX_MATCH, '.');
    }

    render() {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('BookDetails', {'book': this})}
                style={styles.book}>
                <View>
                    <Image style={styles.albumArt} source={{uri: this.getImageURL()}} resizeMode='contain'/>
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
        this.state = {};
        this.state.title = props.title;
    }

    render() {
        console.log(this.props.isLastChapter);
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('ChapterPlayer', {
                    'book': null,
                    'chapter': this
                })}>
                <View style={chapterStyle(this.props.isLastChapter)}>
                    <View style={styles.chapterTitle}>
                        <Text style={{fontFamily: 'product-sans-bold', fontSize: 15}}>{this.state.title}</Text>
                    </View>
                    <View style={styles.playIcon}>
                        <Icon
                            type="material"
                            name="play-circle-outline"
                            color="#000000"/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

function chapterStyle(isLastChapter) {
    return {
        borderBottomWidth: (isLastChapter) ? 0 : 1,
        borderColor: '#eaeaea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 55,
        width: '100%',
        backgroundColor: 'white'
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
    },
    albumArt: {
        height: '80%',
        marginBottom: 5,
    },
    bookMetadata: {
        height: '20%',
    },
    bookMetadataText: {
        fontSize: 14,
        fontFamily: 'product-sans',
    },

    //TODO: Clean up Chapter styles and rendereding logic
    chapterTitle: {
        flex: 0.9
    },
    playIcon: {
        flex: 0.1,
    },
    chapterTouch: {}
});

export {Book, Chapter};
