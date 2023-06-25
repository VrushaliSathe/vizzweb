const logger = require("../core/logger");
const UserTypeModel = require("../models/user-type.model");
const action = {};

action.save = async (condition) => {
    try {
        return await UserTypeModel.create(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error While adding data", err);
        return err;
    }
};

action.update = async (condition, payload) => {
    try {
        const account = await UserTypeModel.findOneAndUpdate(condition.filter, payload, { new: true });
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (condition) => {
    try {
        const account = await UserTypeModel.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (condition) => {
    try {
        const account = await UserTypeModel.findOne(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (condition) => {
    try {
        return await UserTypeModel.find(condition.filter);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (condition) => {
    try {
        return await UserTypeModel.paginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (condition) => {
    try {
        return await UserTypeModel.aggregatePaginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;