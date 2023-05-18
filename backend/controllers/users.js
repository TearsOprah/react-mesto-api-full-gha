const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const {
  STATUS_CREATED,
} = require('../http-status-codes');

function handleUserNotFound(user) {
  if (!user) {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  }
  return user;
}

// получение всех пользователей
function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

// получение пользователя по id
function getUserById(req, res, next) {
  const { id } = req.params;

  User.findById(id)
    .then(handleUserNotFound)
    .then((user) => res.send({ user }))
    .catch(next);
}

// создание нового пользователя
function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(STATUS_CREATED).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch(next);
}

function updateUser(req, res, next, updateData) {
  const { userId } = req.user;
  User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
    .then(handleUserNotFound)
    .then((user) => res.send({ user }))
    .catch(next);
}

// обновление данных профиля
function updateUserProfile(req, res, next) {
  const { name, about } = req.body;
  updateUser(req, res, next, { name, about });
}

// обновление аватара
function updateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  updateUser(req, res, next, { avatar });
}

function login(req, res, next) {
  const { email, password } = req.body;
  const secretKey = 'nvd6Hds3NXk54s3cAsjcFK5sd2lLs4aKa3e4JS3dsa';

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      // создадим токен
      const token = jwt.sign(
        { userId },
        secretKey,
        {
          expiresIn: '7d',
        },
      );
      // вернём токен
      return res.send({ token });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  const { userId } = req.user;
  User.findById(userId)
    .then(handleUserNotFound)
    .then((user) => res.send({ user }))
    .catch(next);
}

module.exports = {
  createUser, getUsers, getUserById, getCurrentUser, updateUserProfile, updateUserAvatar, login,
};
