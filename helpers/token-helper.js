const bcrypt = require('bcryptjs');
const salt = 10;

class TokenHelper {


    async getHash(concatString) {

        return await bcrypt.hash(concatString, salt)
        // .then(function (hash) {
        //     return hash;
        // });

    }

    async compareToken(concateString, hash) {
        return bcrypt.compare(concateString, hash)
        // .then(function (res) {
        //     return res;
        // });
    }

}

module.exports = new TokenHelper();