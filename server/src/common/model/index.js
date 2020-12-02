const mongoose = require("mongoose");
const { mongooseInstance } = require("../mongodb");
const { mongoosastic, getElasticInstance } = require("../esClient");
const { userSchema, requestSchema } = require("../model/schema");

const getMongoostaticModel = (modelName, schema, instanceMongoose = mongooseInstance) => {
  const Schema = new instanceMongoose.Schema(schema);
  Schema.plugin(mongoosastic, { esClient: getElasticInstance(), index: modelName });
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

let requestModel = null;
if (!requestModel) {
  requestModel = getModel("request", requestSchema);
}

let logModel = null;
if (!logModel) {
  logModel = getMongooseModel("log");
}

module.exports = {
  User: userModel,
  Log: logModel,
  Request: requestModel,
};
