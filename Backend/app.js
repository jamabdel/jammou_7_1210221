const express = require('express');
//const bodyParser = require('body-parser');


const helmet = require("helmet"); //Element de sécurité. Helmet securize les headers.
const rateLimit = require("express-rate-limit"); //Element de sécurité. contrôle le débit de requêttes.

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post')
const path = require('path'); //Donne acccès au chemin du systeme de fichier
require('dotenv').config(); //charger la variable d'environnement

// Connexion à la base de données avec mongoose
/*mongoose.connect(process.env.SECRET_DB, { //Connection de l'API au cluster mongoDB
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));*/
//On créer notre application avec express
const db = require("./models/connexion");
db.sequelize.sync({ force: false })
  .then(() => {
  console.log("Synchronisation de la base de données");
  });
const app = express();

// helmet protection contre les attaques de type cross-site scripting
app.use(helmet()); //Helmet est une collection de plusieurs middleware qui définissent des en-têtes HTTP liés à la sécurité


// Définition de headers pour éviters les erreurs de CORS
app.use((req, res, next) => { //Middleware appliqué à toutes les routes, permettant l'envoie de requête et d'accéder à l'API 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
// Enregistrement des routeurs
app.use(express.json()); //Equivalent de bodyparser qui n'est plus utiliser.
//app.use(bodyParser.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/posts', postRoutes); //Enregistrement du routeur pour toutes les demandes effectuées vers /api/sauces
app.use('/api/auth', userRoutes); //La racine de toutes les routes liées à l'authentification ; attendu par le front
//on exporte notre application.
module.exports = app;