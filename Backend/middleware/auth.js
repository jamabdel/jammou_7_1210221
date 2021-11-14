const jwt = require('jsonwebtoken');//Jsonwebtoken nous sert à générer et décripter des tokens.

require('dotenv').config();
//Middleware d'authentification
// require('dotenv').config();Validation userId en comparaison avec le token

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization; //Récupération du token du header
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); //Décodage du token
      const userId = decodedToken.userId;
      if (req.headers.userid !== userId) {
        throw "User ID non valable !";
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error("Requête non valide"),
      });
    }
  };
