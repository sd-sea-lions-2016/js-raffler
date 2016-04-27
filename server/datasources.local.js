var mongoUri = process.env.MONGO_URI

module.exports = {
  db: {
    defaultForType: "mongodb",
    connector: "loopback-connector-mongodb",
    url: mongoUri
  }
};
