const mongoose = require("mongoose");
const { mongooseInstance } = require("../mongodb");
const { userSchema, appointmentSchema, widgetParameterSchema } = require("../model/schema");

const getMongoostaticModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  const Schema = new instanceMongoose.Schema(schema);
  Schema.plugin(require("mongoose-paginate"));
  return mongooseInstance.model(modelName, Schema);
};

const getMongooseModel = (modelName, callback = () => ({})) => {
  const modelSchema = new mongoose.Schema(require(`./schema/${modelName}`));
  callback(modelSchema);
  return mongoose.model(modelName, modelSchema, modelName);
};

const getModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  if (instanceMongoose) return getMongoostaticModel(modelName, schema);
  return getMongooseModel(modelName);
};

let userModel = null;
if (!userModel) {
  userModel = getModel("user", userSchema);
}

let userEventModel = null;
if (!userEventModel) {
  userEventModel = getModel("userEvents", userSchema);
}

let appointmentModel = null;
if (!appointmentModel) {
  appointmentModel = getModel("appointment", appointmentSchema);
}

let widgetParameterModel = null;
if (!widgetParameterModel) {
  widgetParameterModel = getModel("widgetParameter", widgetParameterSchema);
}

let logModel = null;
if (!logModel) {
  logModel = getMongooseModel("log");
}

module.exports = {
  User: userModel,
  UserEvent: userEventModel,
  WidgetParameter: widgetParameterModel,
  Log: logModel,
  Appointment: appointmentModel,
};
