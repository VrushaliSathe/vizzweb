const logger = require("../core/logger");
const AppointmentModel = require("../models/appointment.model");
const action = {};

action.save = async (condition) => {
    try {
        return await AppointmentModel.create(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error While adding data", err);
        return err;
    }
};

action.update = async (condition, payload) => {
    try {
        const account = await AppointmentModel.findOneAndUpdate(condition.filter, payload, { new: true });
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while updating data", err);
        return err;
    }
};

action.delete = async (condition) => {
    try {
        const account = await AppointmentModel.findByIdAndDelete(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error While deleting data", err);
        return err;
    }
};

action.findOne = async (condition) => {
    try {
        const account = await AppointmentModel.findOne(condition.filter);
        return account;
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching data", err);
        return err;
    }
};

action.findAll = async (condition) => {
    try {
        return await AppointmentModel.find(condition.filter);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.paginate = async (condition) => {
    try {
        return await AppointmentModel.paginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

action.aggregatePaginate = async (condition) => {
    try {
        return await AppointmentModel.aggregatePaginate(condition);
    } catch (err) {
        logger.data("Mongoose Service: Error while fetching all data", err);
        return err;
    }
};

module.exports = action;