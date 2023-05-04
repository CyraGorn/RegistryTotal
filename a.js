function validateVietnameseName(name) {
    const regex = /^[^\p{P}\d]+$/u;  // the "u" flag is needed for Unicode support
    return regex.test(name);
}

function hasNonAlphabeticCharacters(input) {
    const regex = /[^\w\s]/;
    return regex.test(input);
}

function escapeSpecialCharacters(str) {
    return str.replace(/[()\[\]{}+*?.\\^$|~]<>/g, "\\$&");
}

var ten = "\\\abcd"
console.log(escapeSpecialCharacters(ten))