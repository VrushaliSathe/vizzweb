const logger = require("../core/logger");
const ClientModel = require("../models/client.model");
const action = {};

action.save = async (condition) => {
    try {
        return await ClientModel.create(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error While adding data", err);
        return err;
    }
};

action.update = async (condition, payload) => {
    try {
        const account = await ClientModel.findOneAndUpdate(condition.filter, {...payload, setUpRequired: false, companySetupDone: true }, { new: true });
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (condition) => {
    try {
        const account = await ClientModel.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (condition) => {
    try {
        const account = await ClientModel.findOne(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (condition) => {
    try {
        return await ClientModel.find(condition.filter);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (condition) => {
    try {
        return await ClientModel.paginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (condition) => {
    try {
        return await ClientModel.aggregatePaginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;