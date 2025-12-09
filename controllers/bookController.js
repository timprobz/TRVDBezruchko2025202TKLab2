const Book = require('../models/Book');

const bookModel = new Book();

class BookController {
    // Отримати всі книги
    async getAllBooks(req, res) {
        try {
            const searchTerm = req.query.search || '';
            const genre = req.query.genre || '';
            const year = req.query.year || '';
            
            let books;
            if (searchTerm || genre || year) {
                books = await bookModel.search(searchTerm, genre, year);
            } else {
                books = await bookModel.getAll();
            }
            
            res.render('books', {
                title: 'Книги',
                books,
                searchTerm,
                selectedGenre: genre,
                selectedYear: year,
                genres: ['трилер', 'фантастика', 'історичний', 'драма', 'класика'],
                years: ['2023', '2022', '2021', '2020']
            });
        } catch (error) {
            console.error('Помилка при отриманні книг:', error);
            res.status(500).render('error', { 
                title: 'Помилка сервера',
                message: 'Не вдалося завантажити список книг' 
            });
        }
    }

    // Отримати форму для створення книги
    getCreateBookForm(req, res) {
        res.render('book-create', {
            title: 'Додати нову книгу',
            genres: ['трилер', 'фантастика', 'історичний', 'драма', 'класика', 'роман', 'поезія', 'детектив'],
            statuses: ['available', 'unavailable']
        });
    }

    // Створити нову книгу
    async createBook(req, res) {
        try {
            const bookData = {
                title: req.body.title,
                author: req.body.author,
                year: parseInt(req.body.year),
                genre: req.body.genre,
                description: req.body.description,
                image: req.body.image,
                isbn: req.body.isbn,
                status: req.body.status
            };
            
            await bookModel.create(bookData);
            
            req.session.successMessage = 'Книгу успішно додано!';
            res.redirect('/books');
        } catch (error) {
            console.error('Помилка при створенні книги:', error);
            res.status(500).render('book-create', {
                title: 'Додати нову книгу',
                error: 'Не вдалося додати книгу',
                formData: req.body,
                genres: ['трилер', 'фантастика', 'історичний', 'драма', 'класика', 'роман', 'поезія', 'детектив'],
                statuses: ['available', 'unavailable']
            });
        }
    }

    // Отримати форму для редагування книги
    async getEditBookForm(req, res) {
        try {
            const bookId = req.params.id;
            const book = await bookModel.getById(bookId);
            
            if (!book) {
                return res.status(404).render('error', {
                    title: 'Книгу не знайдено',
                    message: 'Книга з таким ID не існує'
                });
            }
            
            res.render('book-edit', {
                title: 'Редагувати книгу',
                book,
                genres: ['трилер', 'фантастика', 'історичний', 'драма', 'класика', 'роман', 'поезія', 'детектив'],
                statuses: ['available', 'unavailable']
            });
        } catch (error) {
            console.error('Помилка при отриманні книги для редагування:', error);
            res.status(500).render('error', {
                title: 'Помилка сервера',
                message: 'Не вдалося завантажити дані книги'
            });
        }
    }

    // Оновити книгу
    async updateBook(req, res) {
        try {
            const bookId = req.params.id;
            const bookData = {
                title: req.body.title,
                author: req.body.author,
                year: parseInt(req.body.year),
                genre: req.body.genre,
                description: req.body.description,
                image: req.body.image,
                isbn: req.body.isbn,
                status: req.body.status
            };
            
            const updatedBook = await bookModel.update(bookId, bookData);
            
            if (!updatedBook) {
                return res.status(404).render('error', {
                    title: 'Книгу не знайдено',
                    message: 'Книга з таким ID не існує'
                });
            }
            
            req.session.successMessage = 'Книгу успішно оновлено!';
            res.redirect('/books');
        } catch (error) {
            console.error('Помилка при оновленні книги:', error);
            res.status(500).render('book-edit', {
                title: 'Редагувати книгу',
                book: req.body,
                error: 'Не вдалося оновити книгу',
                genres: ['трилер', 'фантастика', 'історичний', 'драма', 'класика', 'роман', 'поезія', 'детектив'],
                statuses: ['available', 'unavailable']
            });
        }
    }

    // Видалити книгу
    async deleteBook(req, res) {
        try {
            const bookId = req.params.id;
            const deleted = await bookModel.delete(bookId);
            
            if (!deleted) {
                return res.status(404).render('error', {
                    title: 'Книгу не знайдено',
                    message: 'Книга з таким ID не існує'
                });
            }
            
            req.session.successMessage = 'Книгу успішно видалено!';
            res.redirect('/books');
        } catch (error) {
            console.error('Помилка при видаленні книги:', error);
            res.status(500).render('error', {
                title: 'Помилка сервера',
                message: 'Не вдалося видалити книгу'
            });
        }
    }
}

module.exports = new BookController();