const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFound');
const errorHandler = require('./errors/errorHandler');
const rootRouter = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('cors');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;

const app = express();

// использование модуля cors
app.use(cors());
app.use(helmet());

// подключение к базе данных
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', rootRouter);

app.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
