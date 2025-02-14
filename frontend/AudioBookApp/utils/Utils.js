/*
  Utility functions
*/

import {ActivityIndicator, RefreshControl, View} from "react-native";
import * as Settings from "./AppSettings";
import React from "react";
import {NavigationActions, StackActions} from 'react-navigation'

const format = require('string-format');

export const SECOND_IN_MILLIS = 1000;
export const WHITE = '#FFFFFF';
export const GREY = '#D7D7D7';
export const BLUE = '#0074CD';

export function pad(number, size) {
    let s = String(number);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

export function createRefreshControl(refreshing, onRefresh) {
    return (
        <RefreshControl refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Settings.BLUE_TINT]}
                        title="Pull to refresh"
                        titleColor="#fff"/>
    )
}

export function loadingIndicator(animating = true) {
    return (
        <View style={{height: 40, padding: 30}}>
            <ActivityIndicator size='large' animating={animating} color={BLUE}/>
        </View>
    )
}

export function millisToString(millis) {
    let seconds = Math.floor(millis / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    if (hours === 0) {
        return format('{0}:{1}', pad(minutes, 2), pad(seconds % 60, 2));
    }
    return format('{0}:{1}:{2}', pad(hours, 2), pad(minutes % 60, 2), pad(seconds % 60, 2));
}

export function queryString(query = {}) {
    return Object.entries(query)
        .filter(pair => pair[1] !== undefined)
        .map(pair => pair.filter(i => i !== null).map(encodeURIComponent).join('='))
        .join('&');
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

export function resetNavigation(route) {
    return StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: route})],
    });
}
