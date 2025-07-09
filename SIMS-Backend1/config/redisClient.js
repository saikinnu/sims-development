const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL, // e.g., redis://localhost:6379
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.connect(); // returns a promise

module.exports = client;
