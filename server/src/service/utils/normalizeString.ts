export const increment_alphanumeric_str = str => {
    const count = str.match(/\d*$/);
    return `${str.substr(0, count.index)}${++count[0]}`;
};
export const decrement_alphanumeric_str = str => {
    const count = str.match(/\d*$/);
    return `${str.substr(0, count.index)}${count[0] - 1 <= 0 ? '' :count[0] - 1}`;
};
export const test = str => {
    const count = str.match(/\d*$/);
    return count;
};
