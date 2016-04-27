var mongoUri = process.env.MONGO_URI ||
  'mongodb://localhost';
module.exports = {
  db: {
    defaultForType: "mongodb",
    connector: "loopback-connector-mongodb",
    url: mongoUri
  }
};
