// in controllers/stuff.js
const post  = require('../models/Posts ');
const fs = require('fs');
const post = db.posts;


// **************Création d'une nouvelle post  ********(routes Post)**************************//
exports.createpost  = (req, res, next) => {
    const postObject = JSON.parse(req.body.post );
    delete postObject._id;
    const post  = new post ({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        
    });
    // Enregistrement de l'objet post  dans la base de données
    post .save()
        .then(() => res.status(201).json({
            message: 'post  enregistré !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
}

// Lecture d'une post  avec son ID ***********************routes Get***************************//
exports.getOnepost  = (req, res, next) => {
    post .findOne({
        _id: req.params.id
    }).then(
        (post ) => {
            res.status(200).json(post );
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//********************************************* */ routes put/*************************

exports.modifypost  = (req, res, next) => {
    const postObject = req.file ? {
        ...JSON.parse(req.body.post ),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    post .updateOne({
            _id: req.params.id
        }, {
            ...postObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'post  modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//**********************************routes delete***********************************************//

exports.deletepost  = (req, res, next) => { // supprime une post 
    post .findOne({ //nous utilisons  la méthode findOne() dans notre modèle post  pour 
            _id: req.params.id //trouver la post  unique ayant le même _id que le paramètre de la requête ;
        })
        .then(post  => {
            const filename = post .imageUrl.split('/images/')[1]; //on split l'Url de notre image pour obtenir le nom fichier seulement
            fs.unlink(`images/${filename}`, () => { //via ce nom, on supprime l'image de la post  en question.
                post .deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({ //cette post  est ensuite retourné dans une Promise et envoyé au front-end ;
                        message: 'Objet supprimé !'
                    }))
                    .catch(error => res.status(400).json({ //si aucun post  n'est trouvé ou si une erreur se produit, nous envoyons une erreur 
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

// ***********************routes Get***************************//

exports.getAllposts = (req, res, next) => {
    post .find().then(
        (posts) => { //nous utilisons la méthode find() dans notre modèle Mongoose 
            //afin de renvoyer un tableau contenant tous les post s dans notre base de données.
            // À présent, si vous ajoutez une post s , 
            //elle doit s'afficher immédiatement sur votre page post s.
            res.status(200).json(posts);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );

};

//********(routes Post)**************************//

exports.likepost  = (req, res, next) => {

    let like = req.body.like //Initialiser le statut Like
    let userId = req.body.userId //Un utilisateur ne peut avoir qu'une seule valeur pour chaque post 
    let postId = req.params.id //Récupération de l'id de la post 

    if (like === 1) { //Comme indiquer sur les instructions, une valeur de "1" équivaux a un like.
        post.updateOne( //On utilise 'UpdateOne()' pour mettre à jour les likes notre post .
                {
                    _id: postId
                }, //La post  qu'on update est définie par son ID
                {
                    $inc: { //On utilise $inc de MangoDB pour incrémenter nos likes par 1
                        likes: +1
                    },
                    $push: { //On utilise $push de MangoDB pour push notre utilisateur dans le tableau.
                        usersLiked: userId
                    }
                })
            .then(() => res.status(200).json({
                message: "post  liké !"
            })) //On renvoie une réponse positive 200
            .catch(error => res.status(400).json({
                error
            })) //Sinon, un message d'érreur
    } else if (like === -1) { //Comme indiquer sur les instructions, une valeur de "-1" equivaux à un dislike.
        post .updateOne( //On utilise 'UpdateOne()' pour mettre à jour les likes notre post .
                {
                    _id: postId
                }, //La post  qu'on update est définie par son ID
                {
                    $inc: {
                        dislikes: +1
                    }, //On utilise $inc de MangoDB pour incrémenter nos dislikes par 1
                    $push: {
                        usersDisliked: userId
                    }
                }) //On utilise $push de MangoDB pour push notre utilisateur dans le tableau.
            .then(() => res.status(200).json({
                message: 'post  Disliké !'
            })) //On renvoie une réponse positive 200
            .catch(error => res.status(400).json({
                error
            })) //Sinon, un message d'érreur
    } else { //Sinon, la valeur est de 0; comme indiquer sur les instructions, cela équivaux à une annulation d'un like/dislike.
        post .findOne({
                _id: postId
            }) //En ce cas on commence par trouver notre post  via son ID.
            .then(post  => {
                if (post.usersLiked.includes(userId)) { //Si l'utilisateur est présent dans le tableau des likes
                    post.updateOne({
                                _id: postId
                            }, //On update la dite post .
                            {
                                $pull: {
                                    usersLiked: userId
                                }, //On enlève pour  l'utilisateur du tableau likes
                                $inc: {
                                    likes: -1
                                },
                            }) //et on enlève un like.
                        .then(() => res.status(200).json({
                            message: 'Like annulé !'
                        })) //On renvoie une réponse positive 200
                        .catch(error => res.status(400).json({
                            error
                        })) //Sinon, un message d'érreur.

                } else if (post .usersDisliked.includes(userId)) { //Sinon, si l'utilisateur est présent dans le tableu dislikes.
                    post .updateOne({
                                _id: postId
                            }, //On update la dite post 
                            {
                                $pull: {
                                    usersDisliked: userId
                                }, //On enlève pour commencer l'utilisateur du tableau dislikes
                                $inc: {
                                    dislikes: -1
                                },
                            }) //et on enlève un dislike
                        .then(() => res.status(200).json({
                            message: 'Dislike annulé !'
                        })) //On renvoie une réponse positive 200
                        .catch(error => res.status(400).json({
                            error
                        })) //Sinon un message d'érreur.
                }
            })
    }

};