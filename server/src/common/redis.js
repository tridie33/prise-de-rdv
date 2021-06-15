const apicache = require("apicache");
const redisClient = require("redis");
const { AxiosRedis } = require("@tictactrip/axios-redis");
const config = require("../../config");
const packageJson = require("../../package.json");

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

const axiosRedis = new AxiosRedis(redis, {
  expirationInMS: 172800000, // 2 days
  separator: "___",
  prefix: `${packageJson.name}@${packageJson.version}`,
  axiosConfigPaths: ["method", "url", "params", "data"],
});

module.exports = {
  redis,
  cache,
  axiosRedis,
};
