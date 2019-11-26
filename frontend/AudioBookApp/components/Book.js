import React from "react";
import {Icon} from "react-native-elements";
import Collapsible from 'react-native-collapsible';
import {withNavigation} from 'react-navigation';
import {CHAPTER_API_ENDPOINT} from '../utils/AppSettings';
import {Image, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import * as Utils from '../utils/Utils';

const format = require('string-format');


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
            secondaryImageURL: props.secondary_image_url,
            isbn: props.isbn,
            isbn13: props.isbn13,
        };
    }

    hasISBN() {
        return (this.state.isbn !== '') || (this.state.isbn13 !== '');
    }

    getImageURL() {
        if (this.state.imageURL.includes('nophoto') && this.hasISBN()) {
            return this.state.secondaryImageURL;
        }
        return this.state.imageURL;
    }

    getID() {
        return this.state.id;
    }

    getTitle() {
        return this.state.title;
    }

    async loadChapters() {
        //TODO Log how long it takes to load the chapters
        await fetch(format(CHAPTER_API_ENDPOINT, this.state.id))
            .then((response => response.json()))
            .then((responseJSON) => {
                let chapterGroupList = [];
                let chapterList = [];

                // Callback to track the list of chapters created
                let addChapter = (chapter) => {
                    chapterList.push(chapter);
                };

                // Parse the JSON response
                responseJSON.forEach(((c, idx, array) => {
                    // Determine if chapters should be collapsed or expanded by default
                    c.isCollapsed = false;
                    c.book = this; // Insert a reference to the book in the Chapter object
                    c.key = 'ChapterGroup:' + c.id.toString();
                    c.addChapter = addChapter;
                    chapterGroupList.push( React.createElement(ChapterGroup, c));
                }));

                // Update the book state with the new book list
                this.setState({
                    chapterGroupList: chapterGroupList,
                    chaptersLoaded: true,
                    chapterList: chapterList
                });
            });
    }

    getFirstChapter() {
        return this.state.chapterList[0];
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
class ChapterGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            title: props.title,
            book: props.book,
            isCollapsed: props.isCollapsed,
            chapterList: []
        };

        let chapterList = [];

        props.chapters.forEach(((c, idx, array) => {
            c.book = this.state.book;
            c.isLastChapter = (idx === array.length - 1);
            c.key = 'Chapter:' + c.id;
            c.addChapter = props.addChapter;

            chapterList.push(React.createElement(Chapter, c));
        }));

        this.state.chapterList = chapterList;
    }

    _getCaretDirection() {
        if (this.state.isCollapsed) {
            return 'keyboard-arrow-down';
        }
        return 'keyboard-arrow-up';
    }

    render() {
        return (
            <View>

                {/* Render chapter group heading */}
                <TouchableHighlight
                    underlayColor={Utils.GREY}
                    onPress={() => this.setState({isCollapsed: !this.state.isCollapsed})}>
                    <View
                        style={{flexDirection: 'row', alignItems: 'center', height: 55, backgroundColor: Utils.WHITE}}>
                        <View style={styles.chapterGroupTitle}>
                            <Text style={{fontFamily: 'product-sans-bold', fontSize: 15}}>{this.state.title}</Text>
                        </View>
                        <View style={styles.chapterCaret}>
                            <Icon type="material" name={this._getCaretDirection()} color="#000000"/>
                        </View>
                    </View>
                </TouchableHighlight>

                {/* Render the chapters in this group */}
                <Collapsible collapsed={this.state.isCollapsed}>
                    {this.state.chapterList}
                </Collapsible>
            </View>
        )
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
            book: props.book,
            isLastChapter: props.isLastChapter
        };

        props.addChapter(this);
    }

    getID() {
        return this.state.id;
    }

    getTitle() {
        return this.state.title;
    }

    render() {
        return (
            <TouchableHighlight
                style={chapterHighlightStyle(this.state.isLastChapter)}
                underlayColor={Utils.GREY}
                onPress={() => this.props.navigation.navigate('ChapterPlayer', {
                    book: this.state.book,
                    chapter: this,
                })}>

                <View style={chapterStyle(this.state.isLastChapter)}>
                    <View style={styles.chapterTitle}>
                        <Text style={{fontFamily: 'product-sans', fontSize: 15}}>{this.state.title}</Text>
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
        borderColor: '#EAEAEA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    }
}

function chapterHighlightStyle(isLastChapter) {
    return {
        marginBottom: (isLastChapter) ? 5 : 0,
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

    //TODO: Clean up Chapter styles and rendering logic
    chapterGroupTitle: {
        flex: 0.9
    },
    chapterCaret: {
        flex: 0.1
    },
    chapterTitle: {
        flex: 0.9
    },
    playIcon: {
        flex: 0.1,
    },
    chapterTouch: {}
});

export {Book, ChapterGroup, Chapter};
