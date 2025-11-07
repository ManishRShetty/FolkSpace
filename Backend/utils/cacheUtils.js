const redisClient = require("./redisClient");

async function clearCache(pattern) {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cache cleared for pattern: ${pattern}`);
    }
  } catch (err) {
    console.error("Error clearing cache:", err);
  }
}

module.exports = { clearCache };
