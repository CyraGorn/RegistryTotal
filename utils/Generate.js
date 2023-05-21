const rand = require('random-seed').create();

class Generate {
    static getRandomNumber = (min, max) => {
        return rand.intBetween(min, max);
    };

    static getRandomString = (length) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return randomString;
    };

    static getRandomAlphabetString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static getRandomNumericString = (length) => {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static generateUniqueString(lastDigit, min, max) {
        const timestamp = new Date().getTime().toString().slice(lastDigit);
        const randomNum = getRandomNumber(min, max);
        return String(timestamp) + String(randomNum);
    };
}

module.exports = Generate;