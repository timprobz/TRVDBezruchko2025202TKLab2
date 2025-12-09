const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class Book {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data', 'books.json');
    }

    // Читання всіх книг
    async getAll() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Якщо файл не існує, повертаємо порожній масив
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    // Знайти книгу за ID
    async getById(id) {
        const books = await this.getAll();
        return books.find(book => book.id === id);
    }

    // Створити нову книгу
    async create(bookData) {
        const books = await this.getAll();
        const newBook = {
            id: uuidv4(),
            ...bookData,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        
        books.push(newBook);
        await this.save(books);
        return newBook;
    }

    // Оновити книгу
    async update(id, bookData) {
        const books = await this.getAll();
        const index = books.findIndex(book => book.id === id);
        
        if (index === -1) {
            return null;
        }
        
        books[index] = {
            ...books[index],
            ...bookData,
            updatedAt: new Date().toISOString().split('T')[0]
        };
        
        await this.save(books);
        return books[index];
    }

    // Видалити книгу
    async delete(id) {
        const books = await this.getAll();
        const filteredBooks = books.filter(book => book.id !== id);
        
        if (books.length === filteredBooks.length) {
            return false; // Книгу не знайдено
        }
        
        await this.save(filteredBooks);
        return true;
    }

    // Пошук книг
    async search(searchTerm, genre, year) {
        let books = await this.getAll();
        
        if (searchTerm) {
            books = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (genre) {
            books = books.filter(book => book.genre === genre);
        }
        
        if (year) {
            books = books.filter(book => book.year == year);
        }
        
        return books;
    }

    // Зберегти дані
    async save(books) {
        await fs.writeFile(this.dataPath, JSON.stringify(books, null, 2), 'utf8');
    }
}

module.exports = Book;