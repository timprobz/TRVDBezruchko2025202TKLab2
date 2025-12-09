const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування шаблонізатора Mustache
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Глобальні змінні для шаблонів
app.use((req, res, next) => {
    res.locals.siteTitle = 'Бібліотека українських книг';
    res.locals.currentYear = new Date().getFullYear();
    next();
});

// Підключення маршрутів
const pageRoutes = require('./routes/pageRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', pageRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

// Обробка 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Сторінку не знайдено' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});