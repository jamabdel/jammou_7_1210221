//routeur Express
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/post');

//Ajouter une sauce avec et avec "auth" on protege toute les route
//Chaque route aura "Auth" qui permet d'authentifier l'utilisateur sur chaque demandes.
router.post('/', auth, multer, postCtrl.createPost); //On ajoute multer ici également, pour gêrer les modifications d'images.

//Récupérer toutes les sauces
router.get('/users/:id', auth, postCtrl.getAllUsersPosts);
router.get("/", auth, postCtrl.getAllPosts);
//Récupérer toutes une sauces
router.get('/:id', auth, postCtrl.getOnePost);

router.put('/:id', auth, multer, postCtrl.modifyPost); //On ajoute multer ici également, pour gêrer les modifications d'images.
//Supprimée une sauce déterminée
router.delete('/:id', auth, postCtrl.deletePost);//Supprimer une sauce




module.exports = router;