const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 상품 상세 페이지
router.get('/:id', (req, res) => {
    const productId = req.params.id;

    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error(err);
            return res.status(500).send('상품 정보를 불러오는 중 오류가 발생했습니다.');
        }

        if (!product) {
            return res.status(404).send('존재하지 않는 상품입니다.');
        }

        // user 세션 정보를 같이 넘겨줌
        res.render('detail', { product, user: req.session.user });
    });
});

module.exports = router;
