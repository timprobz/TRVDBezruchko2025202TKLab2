const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Отримати всі книги
router.get('/', bookController.getAllBooks);

// Форма для створення книги
router.get('/create', bookController.getCreateBookForm);

// Створити нову книгу
router.post('/create', bookController.createBook);

// Форма для редагування книги
router.get('/edit/:id', bookController.getEditBookForm);

// Оновити книгу
router.post('/edit/:id', bookController.updateBook);

// Видалити книгу
router.post('/delete/:id', bookController.deleteBook);

module.exports = router;