const logger = require("../core/logger");
const action = {};

action.save = async (model, condition) => {
    try {
        return await model.create(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error While adding data", err);
        return err;
    }
};

action.update = async (model, condition, payload) => {
    try {
        const account = await model.findOneAndUpdate(condition.filter, payload, { new: true });
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (model, condition) => {
    try {
        const account = await model.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (model, condition, populate = [], select = '') => {
    try {
        const account = await model.findOne(condition.filter).select(select).populate(populate);;
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (model, condition) => {
    try {
        return await model.find(condition.filter);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (model, condition) => {
    try {
        return await model.paginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (model, condition) => {
    try {
        return await model.aggregatePaginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;