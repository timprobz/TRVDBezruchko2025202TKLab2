const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class User {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data', 'users.json');
    }

    // Читання всіх користувачів
    async getAll() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    // Знайти користувача за ID
    async getById(id) {
        const users = await this.getAll();
        return users.find(user => user.id === id);
    }

    // Створити нового користувача
    async create(userData) {
        const users = await this.getAll();
        const newUser = {
            id: uuidv4(),
            ...userData,
            registrationDate: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        await this.save(users);
        return newUser;
    }

    // Оновити користувача
    async update(id, userData) {
        const users = await this.getAll();
        const index = users.findIndex(user => user.id === id);
        
        if (index === -1) {
            return null;
        }
        
        users[index] = {
            ...users[index],
            ...userData
        };
        
        await this.save(users);
        return users[index];
    }

    // Видалити користувача
    async delete(id) {
        const users = await this.getAll();
        const filteredUsers = users.filter(user => user.id !== id);
        
        if (users.length === filteredUsers.length) {
            return false;
        }
        
        await this.save(filteredUsers);
        return true;
    }

    // Зберегти дані
    async save(users) {
        await fs.writeFile(this.dataPath, JSON.stringify(users, null, 2), 'utf8');
    }
}

module.exports = User;