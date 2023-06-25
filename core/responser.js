const messageCode = require("../error-code");
const logger = require("../core/logger");

const action = {};
const headers = {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Content-Type": "application/json",
};
const statusCode = {
    catch: 500,
    error: 400,
    Unauthorized: 401,
    Forbidden: 403,
    notFound: 404,
    success: 200,
};

const getMessage = (handler, locale, code) => {
    return messageCode[handler][locale][code];
};

action.failure = (data) => {
    logger.data("START:- failure function", data);
    try {
        // Response Data for the client request
        console.log("get messages", getMessage(data.handler, "en", data.messageCode));
        const responseData = {
            body: JSON.stringify({
                error: data.error ? data.error : {},
                message: getMessage(data.handler, "en", data.messageCode),
            }),
            headers: headers,
            statusCode: statusCode.error,
        };
        logger.data("responseData", responseData);
        return responseData;
    } catch (err) {
        logger.error("success error", err);
    }
};

action.notfound = (data) => {
    logger.data("START:- notfound function", data);
    const responseData = {
        body: JSON.stringify({
            data: data.data,
            message: getMessage(data.handler, "en", data.messageCode),
        }),
        headers: headers,
        statusCode: statusCode.notFound,
    };
    logger.data("responseData", responseData);
    return responseData;
};

action.unauthorized = (data) => {
    logger.info("START:- unauthorized function");
    try {
        const responseData = {
            body: JSON.stringify({
                message: getMessage("user", "en", "E002"),
            }),
            headers: headers,
            statusCode: statusCode.Unauthorized,
        };
        logger.data("responseData", responseData);
        return responseData;
    } catch (err) {
        logger.error("unauthorized error", err);
    }
};

action.success = (data) => {
    logger.data("START:- success function", data);
    console.log("data",data)
    try {
        const responseData = {
            body: JSON.stringify({
                data: data.data ? data.data : undefined,
                message: getMessage(data.handler, "en", data.messageCode),
            }),
            headers: headers,
            statusCode: statusCode.success,
        };
        logger.data("responseData", responseData);
        return responseData;
    } catch (err) {
        logger.error("success error", err);
    }
};

action.catchResponse = (data) => {
    logger.data("START:- success function", data);
    console.log("data",data)
    try {
        const responseData = {
            body: JSON.stringify({
                error: data.error ? data.error : undefined,
                message: getMessage(data.handler, "en", data.messageCode),
            }),
            headers: headers,
            statusCode: statusCode.catch,
        };
        logger.data("responseData", responseData);
        return responseData;
    } catch (err) {
        logger.error("success error", err);
    }
};

module.exports = action;