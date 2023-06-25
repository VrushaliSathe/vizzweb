const logger = require("../core/logger");
const ServiceModel = require("../models/service.model");
const action = {};

action.save = async (condition) => {
    try {
        return await ServiceModel.create(condition);
    } catch (err) {
        logger.data("Client Service: Error While adding data", err);
        return err;
    }
};

action.update = async (condition, payload) => {
    try {
        const account = await ServiceModel.findOneAndUpdate(condition.filter, payload, { new: true });
        return account;
    } catch (err) {
        logger.data("Client Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (condition) => {
    try {
        const account = await ServiceModel.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("Client Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (condition) => {
    try {
        
        const account = await ServiceModel.findOne(condition.filter,{ password: 0 }).populate([
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
        logger.data("Client Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (condition) => {
    try {
        return await ServiceModel.find(condition.filter);
    } catch (err) {
        logger.data("Client Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (condition) => {
    try {
        console.log("Condition",condition);
        return await ServiceModel.paginate(condition.filter, condition.option);
    } catch (err) {
        logger.data("Client Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (condition) => {
    try {
        return await ServiceModel.aggregatePaginate(condition.filter, condition.option);
    } catch (err) {
        logger.data("Client Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;