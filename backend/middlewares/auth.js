const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

let secretKey;

if (process.env.NODE_ENV !== 'production') {
  // В режиме разработки, когда файл .env отсутствует
  secretKey = 'development_secret_key';
} else {
  // В режиме production, когда используются значения из файла .env
  require('dotenv').config();
  secretKey = process.env.JWT_SECRET;
}

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

