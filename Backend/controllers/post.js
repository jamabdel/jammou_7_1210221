const db = require("../models");
const Post = db.post;

// Création d'un post
exports.createPost = (req, res, next) => {
  const post = {
    content: req.body.content,
    user_id: req.body.user_id,
  };
  if (req.file) {
    post.image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  Post.create(post)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ err }));
};

// Récupération d'un post selon id
exports.getOnePost = (req, res, next) => {
  const id = req.params.id;
  Post.findByPk(id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ err }));
};

// Récupération de tous les posts par utilisateur
exports.getAllUsersPosts = (req, res, next) => {
  Post.findAll({
    where: { user_id: req.params.id },
    order: [["created_at", "DESC"]],
    include: [
      {
        model: db.user,
      },
    ],
  })
    .then((posts) => {
      const postObject = posts.map((post) => {      
        return Object.assign({
          id: post.id,
          content: post.content,
          user: post.user.pseudo,
          userProfilePicture: post.user.profil_picture,
          userId: post.user.id,
          creationDate: post.created_at,
          image: post.image,
          email: post.user.email,
        });
      });
      res.status(200).json(postObject);
    })
    .catch((err) => res.status(500).json({ err }));
};

// Récupération de tous les posts
exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [["created_at", "DESC"]],
    include: [
      {
        model: db.user,
      },
    ],
  })
    .then((posts) => {
      const postObject = posts.map((post) => {
        return Object.assign({
          id: post.id,
          content: post.content,
          user: post.user.pseudo,
          userProfilePicture: post.user.profil_picture,
          userId: post.user.id,
          creationDate: post.created_at,
          image: post.image,
          email: post.user.email,
        });
      });
      res.status(200).json(postObject);
    })
    .catch((err) => res.status(500).json({ err }));
};

//Modification d'un post
exports.modifyPost = (req, res, next) => {
  const post = {
    content: req.body.content,
  };
  if (req.file) {
    post.image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  } else if (req.body.image === "delete") {
    post.image = "";
  }
  Post.update(post, {
    where: { id: req.params.id },
    returning: true, //Option Sequelize qui permet de retourner le post
    plain: true,
  })
    .then(() => res.status(200).json({ message: "post modified" }))
    .catch((err) => res.status(404).json({ err }));
};

//Suppression d'un post
exports.deletePost = (req, res, next) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => res.status(200).json({ message: "post deleted !" }))
    .catch((err) => res.status(404).json({ err }));
};
