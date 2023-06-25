const logger = require("../core/logger");
const UserModel = require("../models/user.model");
const action = {};

action.save = async (condition) => {
    try {
        return await UserModel.create(condition);
    } catch (err) {
        logger.data("User Service: Error While adding data", err);
        return err;
    }
};

action.update = async (condition, payload) => {
    try {
        const account = await UserModel.findOneAndUpdate(condition.filter, payload, { new: true });
        return account;
    } catch (err) {
        logger.data("User Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (condition) => {
    try {
        const account = await UserModel.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("User Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (condition) => {
    try {
        
        const account = await UserModel.findOne(condition.filter,{ password: 0 }).populate([
            {
                path:'client',
                select: 'name timeZone'
            },
            {
                path:'type',
                select: 'name slug'
            }
        ]);
        return account;
    } catch (err) {
        logger.data("User Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (condition) => {
    try {
        return await UserModel.find(condition.filter);
    } catch (err) {
        logger.data("User Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (condition) => {
    try {
        console.log("Condition",condition);
        return await UserModel.paginate(condition.filter, condition.option);
    } catch (err) {
        logger.data("User Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (condition) => {
    try {
        return await UserModel.aggregatePaginate(condition.filter, condition.option);
    } catch (err) {
        logger.data("User Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;