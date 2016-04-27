var mongoUri = process.env.MONGOLAB_URI

module.exports = {
  db: {
    defaultForType: "mongodb",
    connector: "loopback-connector-mongodb",
    url: mongoUri
  }
};
