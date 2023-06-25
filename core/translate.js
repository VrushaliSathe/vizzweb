const errorCode = require("../error-code");

module.exports.getMessage = (handler, locale, messageCode) =>{
    return errorCode[handler][locale][messageCode];
}