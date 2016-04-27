var mongoUri = process.env.MONGO_URI ||
  'mongodb://bob';
module.exports = {
  db: {
    defaultForType: "mongodb",
    connector: "loopback-connector-mongodb",
    url: mongoUri
  }
};
