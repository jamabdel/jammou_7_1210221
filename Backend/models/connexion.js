

const Sequelize = require("sequelize");


const sequelize = new Sequelize("groupomania0202","admin", "Azerty123", {
  host: "localhost",
  dialect: "mysql",
  
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);

//Liaison entre tables
db.post.belongsTo(db.user);
db.user.hasMany(db.post);

module.exports = db;
