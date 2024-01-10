const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { ConflictError } = require("../errors/ConflictError");
const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const {
  INCORRECT_CREDENTIALS_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
  DUPLICATE_EMAIL_ERROR_MESSAGE,
} = require("../utils/constants");
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError(DUPLICATE_EMAIL_ERROR_MESSAGE);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(INVALID_DATA_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(INCORRECT_CREDENTIALS_ERROR_MESSAGE);
      }
      return bcrypt.compare(password, user.password).then((isPasswordMatch) => {
        if (!isPasswordMatch) {
          throw new UnauthorizedError(INCORRECT_CREDENTIALS_ERROR_MESSAGE);
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "14d",
      });
      res.send({ message: "Successful Login", token });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  const userID = req.user._id;
  User.findById(userID)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports = { createUser, getCurrentUser, loginUser };
