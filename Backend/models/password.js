const passwordValidator = require('password-validator');

// Créer un schéma
const passwordSchema = new passwordValidator();

// Ajoutez-y des propriétés
passwordSchema

    .is().min(8) // Longueur minimale 8
    .is().max(20) // Longueur maximale 20
    .has().uppercase() // Doit avoir des lettres majuscules
    .has().lowercase() // Doit avoir des lettres minuscules
    .has().digits(2) //Doit avoir au moins 2 chiffres
    .has().not().spaces() // Ne devrait pas avoir d'espaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist valeurs

module.exports = passwordSchema;