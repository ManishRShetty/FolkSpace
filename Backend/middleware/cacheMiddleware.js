const redisClient = require("../utils/redisClient");

async function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(` Cache hit: ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(` Cache miss: ${key}`);
    res.sendResponse = res.json;

    res.json = async (body) => {
      try {
        await redisClient.setEx(key, 300, JSON.stringify(body));
      } catch (e) {
        console.error("Redis set cache failed:", e);
      }
      res.sendResponse(body);
    };

    next();
  } catch (err) {
    console.error("Redis cache middleware error:", err);
    next(); 
  }
}

module.exports = cacheMiddleware;
