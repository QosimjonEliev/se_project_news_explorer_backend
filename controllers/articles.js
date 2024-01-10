const ArticleItem = require("../models/article");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");
const { BadRequestError } = require("../errors/BadRequestError");
const { INVALID_DATA_ERROR_MESSAGE } = require("../utils/constants");

const getArticles = (req, res, next) => {
  ArticleItem.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch((err) => next(err));
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  console.log(req.body);
  console.log(req.user);
  ArticleItem.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user,
  })
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INVALID_DATA_ERROR_MESSAGE));
      }
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  ArticleItem.findById(articleId)
    .orFail(() => {
      throw new NotFoundError("An article with the specified id not found");
    })
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        return ArticleItem.findByIdAndDelete(articleId).then(() => {
          res.send({ message: "Article successfully removed" });
        });
      }
      throw new ForbiddenError("Cannot removed another user's article");
    })
    .catch((err) => next(err));
};

module.exports = { getArticles, createArticle, deleteArticle };
