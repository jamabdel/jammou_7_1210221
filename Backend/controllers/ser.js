const bcrypt = require('bcrypt'); //Bcrypt sert à Hash (et donc sécuriser) les passwords bcrpyt permet un cryptage sécurisé avec un algorithme unidirectionnel

const jwt = require('jsonwebtoken'); //jsonwebtoken genère un token (pour que nos users ne se connectent qu'une fois) Créer et vérifier les tokens d'authentification

const db = require('../models/connexion'); //on importe le schéma pour nos utilisateurs.

const User = db.User;
//const CryptoJS = require("crypto-js");

require('dotenv').config();




exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hash du mot de passe avec bcrypt on hash le password avec un salt de 10, le salt ajout du texte aléatoire au hash.
        .then(hash => {

            const user = new user({ // Création du nouvel utilisateur
                email: req.body.email,
                pseudo: req.body.pseudo,
                password: hash,
                profil_picture: req.body.profil_picture,
                is_admin: req.body.is_admin,
            });
            // Sauvegarde du nouvel utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    
                    error
                     
                }));
        })
        .catch(error => res.status(500).json({
            error
            console.log("ca marche pas");
        }));
        
};
// Création de connexion d'utilisateur enregistré (Post login)
exports.login = (req, res, next) => {
    // Recherche d'un utilisateur dans la base de données
    User.findOne({
            email: req.body.email,
        })
        .then(user => {
            // Si on ne trouve pas l'utilisateur
            if (!user) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            // On compare le mot de passe de la requete avec celui de la base de données
            bcrypt.compare(req.body.password, user.password) //avec la fonction compare de bcrypt
                .then(valid => {
                    if (!valid) { //Si le mot de pass et le hash correspondent, les informations d'identification sont valides
                        return res.status(401).json({ // si non renvoier une erreur 401 Unauthorized
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({ //Envoie d'une réponse 200 contenant l'ID user et un token. 
                        userId: user._id, // Création d'un token pour sécuriser le compte de l'utilisateur
                        token: jwt.sign({ //Ce user id encodé sera utilisé pour appliquer le bon user id à chaque objet, afin de ne pas modifier les objets des autres utilisateurs
                                userId: user._id //le token est créer via le User._id.
                            }, //Chaîne secrète de développement temporaire pour encoder le token(à remplacer par une chaîne aléatoire beaucoup plus longue pour la production) 
                            process.env.SECRET_TOKEN, {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};