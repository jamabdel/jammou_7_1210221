import { User } from "../models/connexion";
import { hash as _hash } from "bcrypt";
// Fonction qui crée le compte admin dans la base de données à la connexion s'il n'existe pas
function setAdmin(req, res) {
  User.findOne({ where: { email: "admin@mail.com" } || { pseudo: "admin" } })
    .then((user) => {
      if (!user) {
        _hash("Moderator", 10)
          .then((hash) => {
            const admin = User.create({
              pseudo: "admin",
              email: "admin@mail.com",
              password: hash,
              admin: true,
            })
              .then((admin) => {
                console.log({
                  admin,
                  message: `Votre compte admin est bien créé ${admin.pseudo} !`,
                });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          })
          .catch((error) => {
            res.status(500).send({ error });
          });
      } else {
        console.log({ message: "l'admin est déjà créé" });
      }
    })
    .catch((error) => {
      console.log({ error });
    });
}
export default setAdmin();
