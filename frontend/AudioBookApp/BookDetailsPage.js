import React from "react";
import {FlatList, Image, StyleSheet, Text, View} from "react-native";
import {Button, Icon} from 'react-native-elements'
import * as Utils from "./Utils";


class BookDetailsPage extends React.Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        let book = this.props.navigation.getParam('book');
        await book.loadChapters();

        this.setState({
            book: book
        });
    }

    bookDetailsHeader() {
        return (
            <View key='bookDetailsHeader'>
                <View style={styles.detailsPanel} key='bookDetailsPanel'>
                    <View style={styles.albumArt}>
                        <Image style={{width: '100%', height: '100%'}}
                               source={{uri: this.state.book.getImageURL()}}
                               resizeMode='stretch'/>
                    </View>
                    <View style={styles.bookMetadata}>
                        <Text style={styles.bookTitle} numberOfLines={3}>
                            {this.state.book.state.title}
                        </Text>
                        <Text style={styles.bookAuthor} numberOfLines={2}>
                            {this.state.book.state.author}
                        </Text>
                    </View>
                </View>

                <View style={styles.bookDescriptionPanel}>
                    <Text style={{fontSize: 20, fontFamily: 'product-sans-bold'}}>About the book</Text>
                    <Text style={styles.bookDescription} numberOfLines={5}>
                        {this.state.book.state.description}
                    </Text>
                </View>
                <View style={styles.playButton}>
                    <Button
                        icon={
                            <Icon type="material"
                                  name="play-arrow"
                                  size={15}
                                  color="#ffffff"
                            />
                        }
                        title="Play"
                    />
                </View>
            </View>
        )
    }

    render() {
        // No book to show details
        if (this.state.book == null) {
            return (
                <View style={{height: '100%', justifyContent: 'center'}}>
                    {Utils.loadingIndicator()}
                </View>
            )
        }

        //TODO: Wait for chapters? Or re-render page when they load
        return (
            <View style={styles.bookDetailsPage}>
                <FlatList ListHeaderComponent={this.bookDetailsHeader()}
                          data={this.state.book.state.chapterGroupList}
                          renderItem={({item}) => item}
                          showsVerticalScrollIndicator={false}
                          keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bookDetailsPage: {
        paddingTop: 30,
        paddingRight: 30,
        paddingLeft: 30,
    },
    detailsPanel: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    albumArt: {
        flex: 0.3,
        height: 150,
        marginRight: 15,
        marginBottom: 20
    },
    bookMetadata: {
        flex: 0.7,
    },
    bookTitle: {
        flexWrap: 'wrap',
        marginBottom: 5,
        fontSize: 24,
        fontFamily: 'product-sans-bold',
    },
    bookAuthor: {
        fontFamily: 'product-sans',
        flexWrap: 'wrap',
        fontSize: 20
    },
    bookDescriptionPanel: {
        marginBottom: 10
    },
    bookDescription: {
        fontFamily: 'product-sans',
        fontSize: 15
    },
    playButton: {
        marginBottom: 0
    }
});


export default BookDetailsPage;
