module.exports = {
  db: {
    connector: 'mongodb',
    hostname: 'ds013911mlab.com',
    port: 1391,
    user: 'heroku_mdsgp3sf',
    password: process.env.DB_PASSWORD,
    database: 'heroku_mdsgp3sf',
    name: 'db'
  }
};
