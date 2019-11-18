/*
  Utility functions
*/

const format = require('string-format');

export const SECOND_IN_MILLIS = 1000;
export const WHITE = '#FFFFFF';
export const GREY = '#D7D7D7';

export function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

export function millisToString(millis) {
    let seconds = Math.floor(millis / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    if (hours == 0) {
      return format('{0}:{1}', pad(minutes, 2), pad(seconds % 60, 2));
    }
    return format('{0}:{1}:{2}', pad(hours, 2), pad(minutes % 60, 2), pad(seconds % 60, 2));
}

export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};
