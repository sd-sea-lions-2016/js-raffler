module.export = {
  raffle-js = {
    host:      ds013911.mlab.com,
    port:      13911,
    database:  heroku_mdsgp3sf,
    password:  process.env.DB_PASSWORD,
    name:      heroku_mdsgp3sf,
    user:      heroku_mdsgp3sf,
    connector: mongodb
  }
}
