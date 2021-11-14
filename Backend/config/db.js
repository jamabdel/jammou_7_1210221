module.exports = {
  //Connexion à MySQL
  HOST: "localhost",
  USER: "admin",
  PASSWORD: "Azerty123",
  DB: "groupomania",
  dialect: "mysql",

  //Connection à Sequelize et configuration du pool
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
