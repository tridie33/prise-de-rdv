const apicache = require("apicache");
const redisClient = require("redis");
const config = require("../../config");

const redis = redisClient.createClient(config.redis.port, config.redis.host);

const cache = apicache.options({
  host: config.redis.host,
  port: config.redis.port,
  enabled: ["production", "recette"].includes(config.env),
  debug: false,
  respectCacheControl: true,
  statusCodes: {
    include: [200, 201],
  },
  headers: {
    "cache-control": "no-cache",
  },
}).middleware;

module.exports = {
  redis,
  cache,
};
