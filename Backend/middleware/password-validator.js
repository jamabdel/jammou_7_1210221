const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {

    if (!passwordSchema.validate(req.body.password)) {//Si le mot de passe n'est pas valide d'après notre modele.
        return res.status(400).json({
            message: 'Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces'
        });
    } else {
        next();
    }

}