const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const Op = require("Sequelize").Op;

/* GET full list of books */
router.get("/pages/:page", (req, res) => {
  // Paginate pages
  const books = [];
  const page = req.params.page;
  const limit = 6;
  const offset = limit * (page - 1);

  //Order list ascending by Title name
  Book.findAndCountAll({ raw: true, limit, offset, order: [["title", "ASC"]] })
    .then(data => {
      let numberOfPages = Math.ceil(data.count / limit);
      for (let book in data.rows) {
        books.push(data.rows[book]);
      }
      res.render("books/index", {
        books: books,
        title: "Books",
        pages: numberOfPages
      });
    })
    .catch(function(err) {
      res.send(500, err);
    });
});

/* GET search */
router.get("/search", function(req, res) {
  let query = req.query.search;
  query = query.toLowerCase();
  // console.log(query);

  // Using sequelize Op.like to get options on search
  Book.findAll({
    raw: true,
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: `%${query}%` }
        }, //title
        {
          author: { [Op.like]: `%${query}%` }
        }, //author
        {
          genre: { [Op.like]: `%${query}%` }
        }, //genre
        {
          year: { [Op.like]: `%${query}%` }
        } //year
      ]
    }
  })
    .then(data => {
      res.render("books/index", {
        books: data,
        title: "Search Results",
        inSearch: true
      });
    })
    .catch(function(err) {
      res.send(500, err);
    });
});

/* POST and update from new book form */
router.post("/new", function(req, res) {
  Book.create(req.body)
    .then(function(book) {
      res.redirect("/");
    })
    .catch(function(error) {
      if (error.name === "SequelizeValidationError") {
        res.render("books/new", {
          book: Book.build(req.body),
          errors: error.errors,
          title: "New Book"
        });
      } else {
        throw error;
      }
    })
    .catch(function(err) {
      res.send(500, err);
    });
});

/* GET new book form */
router.get("/new", function(req, res, next) {
  res.render("books/new", { book: Book.build(), title: "New Book" });
});

/* GET book details */
router.get("/:id/update", function(req, res, next) {
  Book.findByPk(req.params.id)
    .then(function(book) {
      if (book) {
        res.render("books/update", {
          book: book,
          title: "Edit Book"
        });
      } else {
        res.render("page-not-found", err);
      }
    })
    .catch(function(err) {
      res.send(500, err);
    });
});

/* POST and update book details */
router.post("/:id/update", function(req, res, next) {
  Book.findByPk(req.params.id)
    .then(function(Book) {
      if (Book) {
        return Book.update(req.body);
      } else {
        res.render("error", err);
      }
    })
    .then(function(Book) {
      res.redirect("/");
    })
    .catch(function(err) {
      // Validation
      if (err.name === "SequelizeValidationError") {
        let book = Books.build(req.body);
        book.id = req.params.id;
        res.render("books/update-book", {
          book: book,
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function(err) {
      res.render("error", err);
    });
});

/* POST and update to delete book details*/
router.post("/:id/delete", function(req, res, next) {
  Book.findByPk(req.params.id)
    .then(function(book) {
      if (book) {
        return book.destroy();
      } else {
        res.render("books/page-not-found");
      }
    })
    .then(() => {
      res.redirect("/books");
    })
    .catch(function(err) {
      res.render("error", err);
    });
});

module.exports = router;
