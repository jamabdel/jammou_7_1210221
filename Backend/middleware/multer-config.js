const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//une constante storage passer à multer comme configuration, 
//qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants: ici les image 
const storage = multer.diskStorage({
    destination: (req, file, callback) => { //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images;
        callback(null, 'images');
    },

    // la fonction filename indique à multer d'utiliser le nom d'origine, 
    //de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
    //Elle utilise ensuite la constante MIME_TYPES de type dictionnaire pour résoudre l'extension de fichier appropriée;
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
//nous exportons ensuite l'élément multer entièrement configuré, il prend la constante storage et gère uniquement les téléchargements de fichiers image
module.exports = multer({
    storage: storage
}).single('image');