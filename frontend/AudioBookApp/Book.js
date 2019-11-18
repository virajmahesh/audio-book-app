import React from "react";
import {Animated, Dimensions, StyleSheet, Text, TouchableHighlight, View, Image} from "react-native";
import {Icon} from "react-native-elements";
import { withNavigation } from 'react-navigation';
import {CHAPTER_API_ENDPOINT} from './Settings';
import * as Utils from './Utils';

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
    }

    getImageURL() {
        return this.state.imageURL;
    }

    async loadChapters() {
      await fetch(format(CHAPTER_API_ENDPOINT, this.state.id))
        .then((response => response.json()))
        .then((responseJSON) => {
            let chapterGroupList = []

            responseJSON.forEach(((c, idx, array) => {
              // Determine if chapters should be collapsed or expanded by default
              if (array.length <= 1) {
                c.isExpanded = true;
              }
              else {
                c.isExpanded = false;
              }
              c.book = this; // Insert a reference to the book in the Chapter object
              chapterGroupList.push(React.createElement(ChapterGroup, c))
            }));

            // Update the book state with the new book list
            this.setState({
                chapterGroupList: chapterGroupList,
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

class ChapterGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            title: props.title,
            book: props.book,
            isExpanded: props.isExpanded
        };

        let chapterList = [];
        props.chapters.forEach(((c, idx, array) => {
              c.book = this.state.book;
              if (idx == array.length - 1) {
                  c.isLastChapter = true;
              }
              else {
                  c.isLastChapter = false;
              }
              chapterList.push(React.createElement(Chapter, c));
        }));

        this.state.chapterList = chapterList;
    }

    _getCaretDirection() {
        if (this.state.isExpanded) {
            return 'keyboard-arrow-up';
        }
        return 'keyboard-arrow-down';
    }

    _renderChapters() {
        if (this.state.isExpanded) {
            return this.state.chapterList;
        }
        return null;
    }

    render() {
        return (
            <View>
                <TouchableHighlight
                    underlayColor={Utils.GREY}
                    onPress={() => this.setState({isExpanded: !this.state.isExpanded})}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 55, backgroundColor: Utils.WHITE}}>
                        <View style={styles.chapterGroupTitle}>
                            <Text style={{fontFamily: 'product-sans-bold', fontSize: 15}}>{this.state.title}</Text>
                        </View>
                        <View style={styles.chapterCaret}>
                            <Icon type="material" name={this._getCaretDirection()} color="#000000"/>
                        </View>
                    </View>
                </TouchableHighlight>
                {this._renderChapters()}
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
          opacity: new Animated.Value(0),
          isLastChapter: props.isLastChapter
        };
    }

    componentDidMount() {
        Animated.timing(
            this.state.opacity,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }
        ).start();
    }

    componentWillUnmount() {
        Animated.timing(
            this.state.opacity,
            {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }

    render() {
        return (
            <TouchableHighlight
                style={chapterHightlightStyle(this.state.isLastChapter)}
                underlayColor={Utils.GREY}
                onPress={() => this.props.navigation.navigate('ChapterPlayer', {
                    book: this.state.book,
                    chapter: this,
                })}>

                <Animated.View style={chapterStyle(this.state.isLastChapter, this.state.opacity)}>
                    <View style={styles.chapterTitle}>
                        <Text style={{fontFamily: 'product-sans', fontSize: 15}}>{this.state.title}</Text>
                    </View>
                    <View style={styles.playIcon}>
                        <Icon type="material" name="play-circle-outline" color="#000000"/>
                    </View>
                </Animated.View>
            </TouchableHighlight>
        )
    }
}

function chapterStyle(isLastChapter, opacity) {
    return {
        borderBottomWidth: (isLastChapter) ? 0 : 1,
        height: 55,
        width: '100%',
        borderColor: '#eaeaea',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        opacity: opacity
    }
}

function chapterHightlightStyle(isLastChapter) {
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

    //TODO: Clean up Chapter styles and rendereding logic
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
    chapterTouch: {

    }
});

export {Book, ChapterGroup, Chapter};
