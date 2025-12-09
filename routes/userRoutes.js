const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Отримати всіх користувачів
router.get('/', userController.getAllUsers);

// Форма для створення користувача
router.get('/create', userController.getCreateUserForm);

// Створити нового користувача
router.post('/create', userController.createUser);

// Форма для редагування користувача
router.get('/edit/:id', userController.getEditUserForm);

// Оновити користувача
router.post('/edit/:id', userController.updateUser);

// Видалити користувача
router.post('/delete/:id', userController.deleteUser);

module.exports = router;