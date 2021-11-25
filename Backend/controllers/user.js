const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/ndex");
const { User } = db.sequelize.models

//const { secret } = require("../config.json");
//const { oldEmployesPassword } = require("../config.json");

//const User = db.User;
const regexEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

//Création d'un utilisateur
exports.signup = (req, res, next) => {
  if (!req.body.email || !req.body.pseudo || !req.body.password) {
    return res.status(400).json({
      message: "missing data",
    });
  } else if (!regexEmail.test(req.body.email)) {
    return res.status(400).json({
      message: "bad request",
    });
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash,
        profil_picture: req.body.profil_picture,
        is_admin: req.body.is_admin,
      };
      User.save(user)
        .then(() => {
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          if ((err.message = "users.email must be unique")) {
            res.status(409).json({ message: "conflict" });
          } else {
            res.status(500).json({ err  });
          }
        });
    })
    .catch((err) => res.status(500).json({ err }));
};

//Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "authentification failed",
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "authentification failed",
            });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, { expiresIn: "24h" }),
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};

//Récupération d'un utilisateur
exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }
      res.status(200).json({
        admin: user.is_admin,
        profilePicture: user.profil_picture,
        userId: user.id,
        email: user.email,
        pseudo: user.pseudo,
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

//Modification d'un utilisateur
exports.modifyUser = (req, res, next) => {
  let password;
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      password = hash;
    });
  }
  const user = {
    email: req.body.email,
    pseudo: req.body.pseudo,
    password,
    is_admin: req.body.is_admin,
  };
  if (req.file) {
    user.profil_picture = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  User.update(user, {
    where: { id: req.params.id },
  })
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        res.status(200).json({ message: "user modified" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};

//Suppression (ou anonymisation) d'un utilisateur
exports.deleteUser = (req, res, next) => {
  User.update(
    {
      email: "ancien employé" + Date.now(),
      pseudo: "ancien employé",
      password: oldEmployesPassword,
      profil_picture: "http://localhost:3000/images/avatar.png",
      is_admin: 0,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        res.status(200).json({ message: "user deleted" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};
