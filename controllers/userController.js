const User = require('../models/User');

const userModel = new User();

class UserController {
    // Отримати всіх користувачів
    async getAllUsers(req, res) {
        try {
            const users = await userModel.getAll();
            
            res.render('users', {
                title: 'Користувачі',
                users,
                roles: ['читач', 'адміністратор'],
                statuses: ['активний', 'неактивний']
            });
        } catch (error) {
            console.error('Помилка при отриманні користувачів:', error);
            res.status(500).render('error', {
                title: 'Помилка сервера',
                message: 'Не вдалося завантажити список користувачів'
            });
        }
    }

    // Отримати форму для створення користувача
    getCreateUserForm(req, res) {
        res.render('user-create', {
            title: 'Додати нового користувача',
            roles: ['читач', 'адміністратор'],
            statuses: ['активний', 'неактивний']
        });
    }

    // Створити нового користувача
    async createUser(req, res) {
        try {
            const userData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };
            
            await userModel.create(userData);
            
            req.session.successMessage = 'Користувача успішно додано!';
            res.redirect('/users');
        } catch (error) {
            console.error('Помилка при створенні користувача:', error);
            res.status(500).render('user-create', {
                title: 'Додати нового користувача',
                error: 'Не вдалося додати користувача',
                formData: req.body,
                roles: ['читач', 'адміністратор'],
                statuses: ['активний', 'неактивний']
            });
        }
    }

    // Отримати форму для редагування користувача
    async getEditUserForm(req, res) {
        try {
            const userId = req.params.id;
            const user = await userModel.getById(userId);
            
            if (!user) {
                return res.status(404).render('error', {
                    title: 'Користувача не знайдено',
                    message: 'Користувач з таким ID не існує'
                });
            }
            
            res.render('user-edit', {
                title: 'Редагувати користувача',
                user,
                roles: ['читач', 'адміністратор'],
                statuses: ['активний', 'неактивний']
            });
        } catch (error) {
            console.error('Помилка при отриманні користувача для редагування:', error);
            res.status(500).render('error', {
                title: 'Помилка сервера',
                message: 'Не вдалося завантажити дані користувача'
            });
        }
    }

    // Оновити користувача
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const userData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };
            
            const updatedUser = await userModel.update(userId, userData);
            
            if (!updatedUser) {
                return res.status(404).render('error', {
                    title: 'Користувача не знайдено',
                    message: 'Користувач з таким ID не існує'
                });
            }
            
            req.session.successMessage = 'Користувача успішно оновлено!';
            res.redirect('/users');
        } catch (error) {
            console.error('Помилка при оновленні користувача:', error);
            res.status(500).render('user-edit', {
                title: 'Редагувати користувача',
                user: req.body,
                error: 'Не вдалося оновити користувача',
                roles: ['читач', 'адміністратор'],
                statuses: ['активний', 'неактивний']
            });
        }
    }

    // Видалити користувача
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deleted = await userModel.delete(userId);
            
            if (!deleted) {
                return res.status(404).render('error', {
                    title: 'Користувача не знайдено',
                    message: 'Користувач з таким ID не існує'
                });
            }
            
            req.session.successMessage = 'Користувача успішно видалено!';
            res.redirect('/users');
        } catch (error) {
            console.error('Помилка при видаленні користувача:', error);
            res.status(500).render('error', {
                title: 'Помилка сервера',
                message: 'Не вдалося видалити користувача'
            });
        }
    }
}

module.exports = new UserController();