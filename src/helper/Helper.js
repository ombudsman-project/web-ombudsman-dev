import _ from "lodash"

export const longText = (text) => {
    return _.isString(text) ? text.length > 40 ? text.substring(0, 33) + "..." : text : '-';
}

export const capitalize = (str) => {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
  }