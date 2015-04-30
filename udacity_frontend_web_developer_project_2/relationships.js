/**
  * This function will return a string representation of
  *    the relationship between two numeric values ('>', '<' or '=').
  *    If either value is non-numeric, it will return an error message.
  * @param {object} x - The first value to be compared.
  * @param {object} y - The second value to be compared.
  * @return {string} - The string representation of the relationship between two
  *    numeric values or an error message.
*/
function getRelationship(x, y) {
    var
        invalidPrefix = 'Can\'t compare relationships because '
        , invalidX
        , invalidY;

    // Evaluate x and y to determine if they are numeric.
    invalidX = isNaN(x);
    invalidY = isNaN(y);

    // Return the relationship.
    if (invalidX && invalidY) {
        return invalidPrefix + trimIfString(x) + ' and ' + trimIfString(y) + ' are not numbers';
    } else if (invalidX) {
        return invalidPrefix + trimIfString(x) + ' is not a number';
    } else if (invalidY) {
        return invalidPrefix + trimIfString(y) + ' is not a number';
    } else if (x > y) {
        return '>';
    } else if (x < y) {
        return '<';
    }
    return '=';
};

/**
  * This function will return a trimmed copy of the argument if it is a string.
  *    Otherwise it returns the original argument.
  * @param {object} value - The value to be trimmed if it is a string.
  * @return {object} - The trimmed copy of the original value if it was a string.
  *    If the original value was not a string, the original value is returned.
*/
function trimIfString(value) {
    if (typeof value === 'string') {
        return value.trim();
    } else {
        return value;
    }
}

// Try logging these functions to test your code!
console.log(getRelationship(1,4));
console.log(getRelationship(1,1));
console.log(getRelationship("that",2));
console.log(getRelationship("this"," something else"));
console.log(getRelationship(3));
console.log(getRelationship("hi"));
console.log(getRelationship(NaN));
console.log(getRelationship(NaN, undefined));