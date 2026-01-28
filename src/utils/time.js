const getCurrentTime = (req) => {
  if (process.env.TEST_MODE === '1') {
    const testTime = req.headers['x-test-now-ms'];
    if (testTime) {
      const timestamp = parseInt(testTime, 10);
      if (!isNaN(timestamp)) {
        return new Date(timestamp);
      }
    }
  }
  return new Date();
};

const getExpiryTime = (createdAt, ttlSeconds) => {
  if (!ttlSeconds) return null;
  return new Date(createdAt.getTime() + ttlSeconds * 1000);
};

module.exports = { getCurrentTime, getExpiryTime };