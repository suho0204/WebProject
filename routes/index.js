var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

router.get('/', function(req, res, next) {
  db.all('SELECT * FROM products', (err, products) => {
    if (err) {
      console.error(err);
      return res.send('상품 정보를 불러오는 데 실패했습니다.');
    }
    res.render('index', {
      user: req.session.user,
      products: products
    });
  });
});

module.exports = router;
